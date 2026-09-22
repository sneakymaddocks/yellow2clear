# Headlight Restoration Website

A fast, single-page marketing site for a mobile headlight restoration business in Manchester. Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Preview it locally

Double-clicking `index.html` works, but a local server is closer to the real thing:

```bash
npx serve .
```

or

```bash
python -m http.server 8000
```

Then open the address it prints.

## Things to change before going live

Everything below lives in **`js/config.js`**.

| What | Where |
|---|---|
| Business name | `BUSINESS.name` |
| Phone number as shown | `BUSINESS.phoneDisplay` |
| Phone number for the call and WhatsApp buttons | `BUSINESS.phoneIntl` (digits only, international, e.g. `447712345678`) |
| Email, opening hours | `BUSINESS.email`, `BUSINESS.hours` |
| Guarantee length | `BUSINESS.guaranteeMonths` |
| Prices | `PRICES.default` (`single`, `both`) |
| Special prices for specific cars | `PRICES.overrides`, e.g. `"Land Rover|Range Rover Sport": { single: 70, both: 110 }` |
| Areas listed | `AREAS.primary`, `AREAS.extended` |
| Before/after photos | `GALLERY` list (see `images/README.md`) |
| Live domain for SEO tags | `BUSINESS.siteUrl`, plus the `canonical` link and `og:` tags in `index.html`, and `sitemap.xml` |

Car makes and models for the quote dropdown are in `js/cars.js`.

Page copy (headlines, FAQ answers, step descriptions) is directly in `index.html`.

Claims to confirm before launch: the 12-month guarantee, same-day availability, and payment methods in the trust bar and FAQ.

## Deploy for free

Any static host works. Drag-and-drop options:

- **Netlify**: netlify.com, "Add new site" then "Deploy manually", drop this folder.
- **Cloudflare Pages**: pages.cloudflare.com, "Upload assets", drop this folder.
- **GitHub Pages**: push the folder to a repository, enable Pages in the repo settings.

Once you have a domain, update `BUSINESS.siteUrl`, the canonical link in `index.html`, and `sitemap.xml`.

## Structure

```
index.html          the page
css/styles.css      styling and responsive rules
js/config.js        business details, prices, areas, gallery list
js/cars.js          make/model data for the quote tool
js/main.js          sliders, gallery lightbox, quote tool, mobile nav, structured data
images/             photos and logo
favicon.svg
robots.txt, sitemap.xml
```
