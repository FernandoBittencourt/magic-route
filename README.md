# Magic Route

Static, mobile-first web app to draw a driving route on the map and quote a home visit from distance-based pricing rules. No backend and no database — settings live in `localStorage`.

**Live site (GitHub Pages):** [https://fernandobittencourt.github.io/magic-route/](https://fernandobittencourt.github.io/magic-route/)

**Source repo:** [github.com/FernandoBittencourt/magic-route](https://github.com/FernandoBittencourt/magic-route)

## Releases

| Tag | Description |
|-----|-------------|
| [`v1.2.0`](https://github.com/FernandoBittencourt/magic-route/releases/tag/v1.2.0) | **Current** — D3 teal receipt UI (live on GitHub Pages) |
| [`v1.1.0`](https://github.com/FernandoBittencourt/magic-route/releases/tag/v1.1.0) | Previous classic card UI (before D3) |

GitHub Pages always deploys `main` (currently **v1.2.0**). To run the old UI locally: `git checkout v1.1.0 && npm ci && npm run dev`.

## Para usuários brasileiros

Abra o link acima no celular, configure a taxa por km em **Configurações** e use endereços em **português** para melhor resultado no Brasil. Moeda **R$** no idioma PT; **$** (USD display) no idioma EN — stored amounts are plain numbers (no exchange).

## Features

- Route distance via [OSRM](https://project-osrm.org/) (OpenStreetMap Germany demo)
- Address geocoding via [Nominatim](https://nominatim.org/) (OSM)
- Optional minimum (flat fee below a distance threshold) and maximum cap
- Optional saved base address
- Portuguese / English UI toggle
- GitHub Pages deployment workflow

## Development

```bash
npm install
npm run dev
```

Dev server: `http://127.0.0.1:4321/magic-route/`

```bash
npm run build
npm run preview
```

## GitHub Pages

Hosted on **GitHub Pages** for `FernandoBittencourt/magic-route`. After cloning, enable **Settings → Pages → Source: GitHub Actions** once (already done on the main repo). Each push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and publishes `dist/`.

`vite.config.ts` sets `base: '/magic-route/'` for project-site URLs.

## API usage (free tiers)

| Service | Policy highlights |
|---------|-------------------|
| **Nominatim** | Max **1 request/second** per app; identifiable `User-Agent`; OSM attribution; user-triggered searches only (no autocomplete). |
| **OSRM demo** | Reasonable non-commercial use; no SLA. |

Magic Route batches geocoding (origin, then ~1.1s later destination) and one route request per calculation.

## Currency note

- **PT** locale: BRL (`R$`) formatting  
- **EN** locale: USD (`$`) formatting  
- Saved rate/min/max values are not converted when switching language.

## License

MIT (app code). Map and routing data remain under [ODbL](https://www.openstreetmap.org/copyright) / respective service terms.
