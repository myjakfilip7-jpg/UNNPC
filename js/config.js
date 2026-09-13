/* ==========================================================
   config.js — jedyne miejsce z kluczami publicznymi.
   Uzupełnij po założeniu kont (patrz README → "Konto i zakupy").
   ========================================================== */
window.UNNPC = {
  SUPABASE_URL: '[SUPABASE_URL]',          // np. https://abcd1234.supabase.co
  SUPABASE_ANON_KEY: '[SUPABASE_ANON_KEY]', // klucz "anon public" (bezpieczny w przeglądarce)
  LS_STORE: '[LS_STORE]',                   // subdomena sklepu Lemon Squeezy, np. unnpc  → unnpc.lemonsqueezy.com
  LS_VARIANTS: {
    'life-rpg': '[LS_VARIANT_LIFE_RPG]',
    'investor-tracker': '[LS_VARIANT_TRACKER]',
  },
};
