# Konto + zakupy — instrukcja uruchomienia (ok. 45 min)

Architektura: **strona statyczna (Hostinger)** → **Lemon Squeezy** (checkout, VAT, faktury) → webhook → **Supabase** (baza zakupów + logowanie) → strona `biblioteka.html` pokazuje kupione szablony z linkami do duplikacji w Notion.

```
[Kup] → LS checkout overlay → order_created → Edge Function ls-webhook → purchases(email, product)
[Zaloguj] → Supabase Auth (magic link / Google) → my_library() → linki Notion tylko dla kupujących
```

Pliki: `supabase/migrations/0001_init.sql`, `supabase/functions/ls-webhook/index.ts`, `js/config.js`, `js/account.js`, `konto.html`, `biblioteka.html`, `css/account.css`.

---

## 1. Supabase (15 min)

1. supabase.com → New project (region: EU Frankfurt). Zapisz **Project URL** i **anon public key** (Settings → API).
2. SQL Editor → wklej całą zawartość `supabase/migrations/0001_init.sql` → Run.
3. Table Editor → `products` → uzupełnij `notion_url` (link „Share → Publish → Duplicate as template” z Notion) dla `life-rpg` i `investor-tracker`. `ls_variant_id` uzupełnisz po kroku 2.
4. Authentication → Providers:
   - **Email**: włączone, „Confirm email” może być off (magic link i tak weryfikuje).
   - **Google**: włącz, wklej Client ID/Secret z Google Cloud Console (OAuth → Authorized redirect URI: `https://<projekt>.supabase.co/auth/v1/callback`).
5. Authentication → URL Configuration:
   - Site URL: `https://unnpc.com` (na razie `https://yellow-grasshopper-956203.hostingersite.com`)
   - Redirect URLs: dodaj `https://unnpc.com/**` i adres tymczasowy z `/**`.
6. Authentication → Email Templates → „Magic Link”: zmień nadawcę/treść na UNNPC (opcjonalnie własne SMTP, np. Resend, żeby maile nie lądowały w spamie).

## 2. Lemon Squeezy (15 min)

1. lemonsqueezy.com → Store: nazwa `UNNPC`, waluta **PLN** (LS przeliczy na USD/EUR dla klientów zagranicznych). Subdomena sklepu → wpisz do `js/config.js` jako `LS_STORE`.
2. Products → New:
   - **Life RPG** — 199 zł, one-time, „Digital product”. W sekcji Files nic nie wgrywaj (dostawa przez bibliotekę). W „Confirmation / Receipt” dopisz: *Zaloguj się na unnpc.com/konto.html tym samym e-mailem, żeby otworzyć szablon.*
   - **Investor Tracker** — 0 zł (Pay what you want z minimum 0 lub cena 0), one-time.
   - Skopiuj **Variant ID** każdego produktu (Product → Variants → ID) → `js/config.js` (`LS_VARIANTS`) **i** do tabeli `products.ls_variant_id` w Supabase.
3. Settings → Webhooks → Add: URL `https://<projekt>.supabase.co/functions/v1/ls-webhook`, Signing secret (wymyśl, 32+ znaki), zdarzenia: `order_created`, `order_refunded`.
4. Settings → Checkout: włącz PayPal; BLIK/karty są domyślnie. Wygląd: ciemny motyw, logo UNNPC.
5. Settings → Tax: LS jako Merchant of Record — nic nie konfigurujesz, VAT liczą i odprowadzają sami. Ty dostajesz wypłatę netto (Stripe/PayPal payouts).

## 3. Edge Function (10 min)

```bash
npm i -g supabase
supabase login
supabase link --project-ref <ref>
supabase secrets set LS_WEBHOOK_SECRET='<ten sam co w LS>'
supabase functions deploy ls-webhook --no-verify-jwt
```
`SUPABASE_URL` i `SUPABASE_SERVICE_ROLE_KEY` są dostępne w funkcji automatycznie.

Test: LS → Webhooks → „Send test event” (order_created) → w Supabase `purchases` pojawi się wiersz. Uwaga: test event ma losowy `variant_id` → funkcja odpowie `202 Unknown variant` — to OK; prawdziwe zamówienie trafi.

## 4. Strona (5 min)

1. `js/config.js` → wpisz `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `LS_STORE`, `LS_VARIANTS`.
2. `biblioteka.html` → `[EMAIL_WSPARCIA]`.
3. Commit + push → Hostinger wdroży sam.

## 5. Test end-to-end

1. Na stronie: „Darmowy Investor Tracker” → wpisz e-mail → overlay LS (0 zł) → potwierdź.
2. Przekierowanie na `konto.html` z wypełnionym e-mailem → „Wyślij link logowania” → klik w mailu → `biblioteka.html` pokazuje Investor Tracker z przyciskiem „Otwórz w Notion”.
3. Zakup Life RPG: LS ma **Test mode** (przełącznik w sklepie) — karta testowa `4242 4242 4242 4242`. Po zakupie produkt pojawia się w bibliotece bez odświeżania konta.
4. Zwrot z panelu LS → status `refunded` → produkt znika z biblioteki.

## Bezpieczeństwo (jak to działa)

- Linki do Notion (`products.notion_url`) **nie są** czytelne z przeglądarki — tabela `products` ma RLS, a anon/authenticated dostają tylko widok `products_public` bez linku. Link zwraca wyłącznie funkcja `my_library()` dla zalogowanego e-maila, który ma opłacony zakup.
- Webhook weryfikuje podpis HMAC (nagłówek `X-Signature`) — bez poprawnego sekretu nikt nie doda sobie zakupu.
- Klucz `anon` jest publiczny z założenia; klucz `service_role` istnieje tylko w Edge Function.
- Ktoś kupi innym e-mailem niż loguje? Widzi pustą bibliotekę z komunikatem — Ty w Supabase zmieniasz `purchases.email` ręcznie (1 wiersz).

## Później (nie teraz)

- Własna domena mailowa dla magic linków (Resend, 5 min) — lepsza dostarczalność.
- Kupony LS (`-20% NA START` = kod `START20`).
- Upsell w bibliotece już jest (sekcja „Brakuje Ci Life RPG?”).
- Aktualizacje szablonu: zmieniasz `notion_url` w jednym miejscu, wszyscy kupujący mają nowy link.
