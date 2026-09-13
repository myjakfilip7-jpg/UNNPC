# unnpc.com — strona sprzedażowa Life RPG (Notion)

Statyczna strona: HTML + CSS + JS (GSAP ScrollTrigger). Zero builda, zero zależności npm — wgrywasz pliki i działa.

## Struktura

```
index.html          — cała strona (sekcje: hero, ticker, problem, moduły, level up, motywy, tracker, cennik, opinie, FAQ, CTA)
css/style.css       — motyw Dark HUD (zmienne w :root), responsywność, reduced-motion
js/shots.js         — "screenshoty" Notion renderowane w HTML (placeholder do podmiany na PNG)
js/main.js          — animacje: split hero, 3D flatten, pinned deck modułów, XP bar, horizontal motywy, tilt cennika
js/vendor/          — gsap.min.js, ScrollTrigger.min.js (3.12.5, lokalnie — bez CDN)
img/                — favicon.svg, og.jpg (podgląd linku w social/Meta Ads)
404.html, .htaccess, robots.txt, sitemap.xml — pliki produkcyjne pod Hostinger
```

## Deploy na Hostinger

**Wariant A — Git (zalecany):** hPanel → Zaawansowane → **Git** → Utwórz nowe repozytorium → URL `https://github.com/myjakfilip7-jpg/UNNPC.git`, gałąź `main`, katalog `public_html` → Utwórz → **Wdróż**. Włącz auto-deploy (webhook), żeby każdy push aktualizował stronę.

**Wariant B — GitHub Actions (FTP):** w repo → Settings → Secrets → dodaj `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (hPanel → Pliki → Konta FTP). Workflow `.github/workflows/deploy.yml` wgrywa pliki po każdym pushu.

**Wariant C — ręcznie:**

1. hPanel → Menedżer plików → `public_html/` (albo katalog subdomeny testowej).
2. Wgraj **całą zawartość** tego folderu (index.html, css/, js/).
3. Gotowe. Bez domeny testujesz pod adresem tymczasowym z hPanelu.

## Co podmienić przed startem

- `[LINK_CHECKOUT]` (2 miejsca w `index.html`) → link do Lemon Squeezy / Gumroad.
- Formularz `.lead` (`action="#"`) → endpoint newslettera (MailerLite / ConvertKit / Brevo) albo Formspree.
- `[LICZBA]` w hero i `[OPINIA — …]` w sekcji opinii → prawdziwe dane po becie.
- Screenshoty: wrzuć PNG do `img/` i wstaw `<img src="img/karta-postaci.png" alt="">` do środka odpowiedniego `<figure data-shot="…">` — `shots.js` wtedy nie nadpisze zawartości.
- Linki w stopce (Regulamin, Prywatność, Kontakt, TikTok).

## Animacje (main.js)

| Sekcja | Efekt |
|---|---|
| Hero | split słów z maską, screenshot z `rotateX(28°)` spłaszcza się scrubem; parallax myszką; pływające chipy |
| Ticker | nieskończony marquee |
| Problem | liczniki 0 → N przy wejściu |
| Moduły | sekcja **pinowana**, 6 kart w 3D wymienia się scrubem, kroki po lewej podświetlają się |
| Level up | pasek XP 0 → 3000 scrubem, `LEVEL UP → 13` po przekroczeniu środka |
| Motywy | **horizontal scroll** pinowany, karty obracają się w Y podczas przejazdu |
| Cennik | tilt 3D na hover |

Na ekranach < 900 px pinowanie jest wyłączone (zwykłe reveale, motywy jako poziomy scroll palcem). Przy `prefers-reduced-motion` wszystko statyczne.
