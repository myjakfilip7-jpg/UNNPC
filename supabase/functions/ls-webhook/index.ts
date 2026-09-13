// ==========================================================
// Supabase Edge Function: webhook Lemon Squeezy → purchases
// Deploy:  supabase functions deploy ls-webhook --no-verify-jwt
// Secrets: supabase secrets set LS_WEBHOOK_SECRET=... (ten sam co w LS → Settings → Webhooks)
// Zdarzenia w LS: order_created, order_refunded
// ==========================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const enc = new TextEncoder();

async function verify(raw: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(raw));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === signature;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const raw = await req.text();
  const sig = req.headers.get("x-signature") ?? "";
  const secret = Deno.env.get("LS_WEBHOOK_SECRET") ?? "";
  if (!secret || !(await verify(raw, sig, secret))) return new Response("Bad signature", { status: 401 });

  const event = JSON.parse(raw);
  const name: string = event?.meta?.event_name ?? "";
  const attrs = event?.data?.attributes ?? {};
  const orderId = String(event?.data?.id ?? "");
  const email: string = (attrs.user_email ?? "").toLowerCase();
  const variantId = String(attrs.first_order_item?.variant_id ?? "");
  const totalPln = Number(attrs.total ?? 0); // LS podaje w najmniejszej jednostce waluty sklepu

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  if (name === "order_created") {
    const { data: product } = await supabase.from("products").select("id").eq("ls_variant_id", variantId).single();
    if (!product) return new Response(`Unknown variant ${variantId}`, { status: 202 });

    const { error } = await supabase.from("purchases").upsert(
      { email, product_id: product.id, ls_order_id: orderId, ls_customer_id: String(attrs.customer_id ?? ""), status: "paid", amount_pln: totalPln },
      { onConflict: "ls_order_id" },
    );
    if (error) return new Response(error.message, { status: 500 });
    return new Response("ok");
  }

  if (name === "order_refunded") {
    await supabase.from("purchases").update({ status: "refunded" }).eq("ls_order_id", orderId);
    return new Response("ok");
  }

  return new Response("ignored", { status: 202 });
});
