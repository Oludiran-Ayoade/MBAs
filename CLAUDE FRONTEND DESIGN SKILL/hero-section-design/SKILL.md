---
name: hero-section-design
description: Designs the hero (first screen) of any website, for any type of business, brand, portfolio, clinic, shop, studio or app. Built from an analysis of 105 award-level hero sections. Gives a decision procedure (pick an archetype from the business and the assets), a spec for each archetype, phone adaptations, copy rules, and a pre-flight checklist. Use whenever a hero, landing page, home page or redesign is built, before writing any markup.
---

# Hero Section Design

> Governs the **first screen only**. The rest of the page follows `studio-design-taste` (dials, palette, type, shape rules, pre-flight). When the two disagree about the hero, this skill wins.
> Source: 105 hero sections collected in `agents/hero-section inspiration designs/` (agency, studio, travel, hospitality, architecture, fashion, SaaS, e-commerce, music and event sites). Numbers like `#27` refer to the screenshots in filename order, so any rule here can be checked against a real example.

---

## 0. The one idea

A great hero does **one** job in under three seconds: it makes a stranger feel *what this is, who it is for, and what to do next*, using **one dominant visual** and **one strong line of type**. Everything in the 105 references is a variation of that. What separates them from a template is not decoration, it is **commitment**: one big thing, treated with confidence, and nothing competing with it.

---

## 1. What the 105 heroes have in common (the analysis)

### 1.1 Archetypes found (a hero usually blends two)

| # | Archetype | Share (approx.) | Signature | Examples |
|---|---|---|---|---|
| A | **Full-bleed photo or video, type on top** | ~30% | Edge-to-edge image or looping film, a scrim, one headline, small nav | `#1 #8 #10 #12 #14 #15 #17 #27 #36 #37 #41 #44 #55 #56 #58 #59 #79 #83 #88 #95 #100 #101 #102 #105` |
| B | **Oversized type or wordmark as the hero** | ~17% | The brand name or one phrase fills the width; image secondary or absent | `#19 #20 #21 #60 #61 #62 #63 #64 #65 #67 #70 #80 #91 #94 #96 #38` |
| C | **Cinematic dark with 3D or CGI** | ~12% | Near-black field, one rendered object or scene, light-weight type | `#3 #5 #6 #7 #13 #18 #32 #45 #46 #53 #76 #86` |
| D | **Bold flat colour field** | ~12% | One saturated colour (red, orange, lime, cobalt, green) fills the screen | `#11 #16 #19 #21 #28 #30 #38 #61 #81 #94 #104` |
| E | **Clean product or proof hero (light)** | ~12% | Calm background, centred or left headline, product mock-up or review cards, trust row | `#2 #4 #24 #39 #42 #57 #66 #92 #99 #70 #77` |
| F | **Split: text one side, image or graphic the other** | ~8% | 50/50 or 40/60, strong alignment | `#34 #35 #49 #50 #77 #87 #103` |
| G | **Collage, mosaic or grid of images** | ~8% | Many images tiled or scattered, type over or beside | `#8 #26 #29 #52 #69 #75 #84 #97 #98` |
| H | **Functional hero (a tool in the hero)** | ~5% | Search, booking, prompt or card sits in the hero | `#1` prompt box, `#15` hotel search, `#83` trip finder, `#17` property card |

### 1.2 Rules every strong example obeys

1. **One focal point.** Exactly one of: a photograph, a film, a giant word, a colour field, a 3D object. Never two competing.
2. **Short headline.** 2 to 9 words in 90% of cases ("Building Relationships", "Take time with us", "Design the right thing, the right way", "Pause hiring. Start designing."). It states a stance or a result, not the company's history.
3. **Scale contrast.** The headline is either **huge** (fills a third to full width) or **small and quiet** (a calm 2 to 3 line statement in a corner). The mid-sized, centred, 3-line heading is the sign of a template.
4. **Type does the decorating.** Single typeface or one pairing. Emphasis comes from weight, italic, colour or an outlined word (`#84`, `#24`, `#99`, `#66`, `#87`), not from boxes and icons.
5. **Tiny, calm navigation.** Small text or a single pill; the nav never competes with the headline. Often a floating pill (`#13 #16 #23 #53 #99`), a bare text row, or "Menu" only.
6. **At most two actions.** One primary, one secondary or text link. Many heroes have just one ("Download", "Get in touch", "Book a call").
7. **Contrast is engineered.** Light type on a scrim over photos, black on white, white on saturated colour. Text is never left to chance on a busy image.
8. **The hero is a frame.** Many sit inside a rounded, inset container with a visible page edge (`#19 #32 #33 #36 #37 #52`), which makes it feel designed.
9. **Cues to continue.** "Scroll", "Scroll to explore", a thin line or arrow, a partial next section peeking at the bottom (`#20 #21 #35 #39 #48 #57 #72`).
10. **Proof lives at the bottom edge, small.** Logo strip (`#31 #53 #77`), star rating (`#2 #57`), a live counter (`#50`), review cards (`#92`), client names. Never a big block above the fold.
11. **Real people and real work win.** Photographs of real subjects with real expression (`#12 #44 #52 #58 #84`) beat stock smiles. Where there are no photos, an illustration system or a single object does the work (`#38 #87 #91`).
12. **Motion is slow and physical.** Film loops, word-by-word rise, scale settle, marquee, cursor reaction. Never a loud bounce.
13. **Colour is committed.** One brand colour used at full strength (`#16 #19 #21 #94`), or a near-monochrome with one pop (`#58` yellow words, `#62` stone, `#102` warm dark). Not a gradient of five colours.
14. **Functional heroes put the task first.** If the visitor's goal is to search, book or ask, that control is in the hero and the headline is short (`#15 #83 #1`).

### 1.3 What the weak or generic ones do (avoid)

- Centred headline, subtitle, two buttons, then a stock photo of a laptop. (The "SaaS template".)
- Four or more text elements stacked (badge, headline, paragraph, bullets, button, button, rating, logos).
- A busy image with white text and no scrim.
- A headline that is the company name plus a category noun ("Acme Solutions: Professional Services").
- Mid-size headline in a mid-weight font in a mid-grey. Nothing is wrong, nothing is memorable.
- A slider of three hero slides with the same layout. (Pick one.)

---

## 2. Decision procedure

Do these in order. Write the result as a one-line **Hero Read** before any code:

> *"Hero read: \<business type\> for \<audience\>, \<archetype(s)\>, \<focal element\>, \<mood word\>, \<primary action\>."*

### Step 1: Read the business and the assets

| Question | Why it matters |
|---|---|
| What does the visitor want to **do** in the first 10 seconds (book, call, buy, enquire, browse, trust)? | Chooses the primary action and whether the hero is functional (H). |
| What **assets exist** (own photographs, film, product shots, logo, brand colour, nothing)? | Photographs lead to A or F; nothing leads to B, D or an illustration system. |
| How **sensitive** is the subject (health, legal, finance, children, safety)? | High sensitivity: calmer, lighter, clearer, one real person, no gimmicks, no unproven claims. |
| How **expressive** may the brand be (creative studio vs. dentist)? | Sets the dials below. |
| Who **decides** (procurement panel, parents, a design-literate buyer, a recruiter)? | Audience beats taste. |

### Step 2: Choose the archetype from the business type

| Business type | First choice | Second choice | Avoid |
|---|---|---|---|
| **Clinic, physio, dental, therapy, wellness** | A (own photo of real staff or a real treatment), calm scrim, glass info panel with hours and address | F (photo right, text left) on a light ground; E if there is an app or booking tool | C and D (too theatrical); stock handshakes; blood-red fields |
| **Law, accounting, consulting, finance** | E or F on a calm ground, serif or restrained sans, one proof line | B with a short statement in large quiet type | Neon colour fields; heavy 3D |
| **Restaurant, cafe, bar, hotel, hospitality** | A (food, room or terrace, full-bleed, warm), a booking or menu action; H for a booking bar (`#15`) | B with a script or serif wordmark over a dark food photo | Product-mockup heroes |
| **Trades, construction, roofing, garage, industrial** | A or G (real job photos, strong type, phone number visible), D in one strong brand colour | B with a bold condensed headline | Delicate light-weight type; abstract art |
| **Retail, e-commerce, DTC product** | A or F with the product, or D in the brand colour; the shop or offer link is the primary action | G (lookbook mosaic) | Text-only |
| **Fashion, beauty, salon, spa** | A with a large editorial portrait (`#100 #101 #34 #104`), huge serif or condensed wordmark, minimal nav | B | Cluttered proof rows |
| **Photographer, filmmaker, artist, musician (portfolio)** | A or G led by the work itself (`#100 #12 #95 #59 #103`), name as the headline | B with the name as a wordmark | Taglines that say less than the work |
| **Designer, developer, studio, agency** | B, C or D; commit hard to one idea (`#20 #21 #61 #64 #65 #94 #96`) | G or F | A tidy template (this is where you must stand out) |
| **Architecture, interiors, real estate, property** | A with one hero building or room, a small quiet statement (`#10 #27 #80 #79 #105 #17`); H for property search | F | Heavy colour fields; noise |
| **Travel, tour, outdoors, events, festival** | A full-bleed landscape or film (`#36 #37 #71 #83`), search or enquiry in the hero (H) | B | Dark CGI |
| **SaaS, app, AI product** | E (product, phone or UI in the hero, trust row) or C (dark, one object); one download or start action (`#2 #3 #4 #39 #57`) | H (the product's input in the hero, `#1`) | Stock photos of people at laptops |
| **Education, charity, community, public sector** | A or F with real people, high contrast, plain language, a clear action | E | Gimmicks; low-contrast type |
| **Personal brand, creator, founder** | A or F with a real portrait and a strong first-person line | B | Generic gradients |

### Step 3: Set the three dials for the hero

| Dial | Low | High |
|---|---|---|
| **Expression** (type scale, motion, colour) | Clinic, law, public sector: 3 to 4 | Studio, fashion, event: 8 to 10 |
| **Density** (items on the first screen) | 2 to 3 elements | 4 maximum, never more |
| **Motion** | Static image, one fade | Film loop, word rise, marquee |

If you cannot decide, pick **A with a scrim and one headline**. It is the most reliable and the best fit for businesses with real photographs.

### Step 4: Write the content (before the layout)

- **Headline** (H1): 2 to 9 words. Pick one pattern:
  - *Outcome*: "Get moving without the pain"
  - *Stance*: "Design the right thing, the right way"
  - *Invitation*: "Take time with us"
  - *Name*: the brand or person as a wordmark, with one small descriptor
  - *Direct statement of what it is*: "Physiotherapy in Galway City"
  Use real words from the client's own copy where possible. No superlatives you cannot prove ("best", "leading", "number one") unless the client states and can support it.
- **One supporting line**, 8 to 20 words, plain language: what, for whom, where.
- **Primary action**: a verb the visitor wants ("Book online", "Call 091 …", "Get a quote", "View the work", "Download"). Same wording and intent everywhere on the site.
- **Secondary action**: optional; a text link or ghost pill, a different intent from the primary ("Call" next to "Book online", "See our work").
- **Proof**: one small item at most (rating, client row, years, review line). Only real, supplied facts.
- No em dashes or en dashes in copy. Use commas, full stops or hyphens.

**Maximum four text elements** in the hero: headline, one line, one or two actions, plus an optional small info or proof element. Nav and the preview banner do not count.

---

## 3. Specs by archetype

Common to all: `min-height: 100svh` (or `max(620px, 100svh)`), not `100vh`; headline as the largest element on the page; actions reachable by thumb on a phone; text contrast at least 4.5:1 (3:1 for 24px+); one `h1` only.

### A. Full-bleed photo or film with type on top

- **Image**: at least **1600 px wide**, ideally 2000+, with a clear calm area for type. Provide a phone crop (`<picture>` with a 900 px source), do not just let `object-fit: cover` guess. Preload the hero image. Use `fetchpriority="high"` and no lazy loading.
- **Scrim**: a gradient anchored where the type sits. Typical: `linear-gradient(0deg, rgb(0 0 0 / .85) 0%, rgb(0 0 0 / .5) 30%, rgb(0 0 0 / .08) 60%, rgb(0 0 0 / .3) 100%)`, tinted to the brand's darkest tone, never pure black on a warm photo. Add a left-to-right gradient when type is on the left.
- **Type**: light weight (300) with **one bold word** is the signature ("Get moving without the *pain*"), or a bold single line (`#10 #12`). Size `clamp(2.9rem, 8.4vw, 6.2rem)`, tight tracking (`-.04em`), line-height about 1, `max-width` about 11ch so lines break well.
- **Position**: bottom-left (editorial, most reliable), centred (manifesto, travel), or bottom with a card at the right.
- **Glass info panel** (optional, very good for clinics, hotels, restaurants, venues): `backdrop-filter: blur(20px) saturate(1.25)`, `background: rgb(0 20 60 / .5)`, 1px light border, inset highlight, 16px radius; contains hours, address, directions. Provide a solid fallback for `@supports not (backdrop-filter)` and `prefers-reduced-transparency`.
- **Header**: transparent over the image with light text, becomes solid after a few pixels of scroll (a `.stuck` class from an `IntersectionObserver` or scroll handler).
- **Motion**: image eases from `scale(1.07)` to `1`; headline words rise in turn (80 ms stagger); text and buttons fade up. All off under `prefers-reduced-motion`.
- **Film**: autoplay muted loop, `playsinline`, a poster frame, under 6 MB, a still on slow connections and reduced motion.

### B. Oversized type or wordmark

- The word or phrase spans most of the width. Use `font-size: clamp(4rem, 17vw, 17rem)` or fit the text with viewport units; `line-height: .8` to `.9`; tracking `-.05em` to `-.07em`.
- Use a **heavy grotesk** (weight 700 to 900), a condensed display face, or a quiet **light serif**. Pick one. Do not mix.
- Background: flat white, flat black, or a flat brand colour. Add **one** small element (a rotating badge `#20`, a 3D object `#67`, a photograph cut into the letters `#62`, a small descriptor in a corner).
- On phones the word can break onto two lines; size it so the longest line still fills the width.
- Good for: studios, agencies, brands with a short distinctive name, portfolios. Weak for: businesses whose visitors need practical information at once (add a small info line and a call button).

### C. Cinematic dark with one object

- Near-black or deep-tinted background, **one** rendered or photographed object or scene (a moon on a hill `#13`, a planet cluster `#3`, a glass sculpture `#46`, a figure with a halo `#32`).
- Light-weight (300) light type, small, high contrast. Subtle particle or line field is acceptable (`#5`).
- Motion: slow rotation or parallax on the object. Respect reduced motion.
- This is a **visual style, not a theme toggle**. Do not implement it as dark mode, and do not add a light/dark switch unless the user asks.
- Only use it when real 3D or art-directed assets exist. Do not fake it with a stock gradient.

### D. Bold colour field

- Fill the first screen with one saturated colour. Type in black or white at maximum contrast. Optional: a cut-out figure, an illustration, a photograph in a rounded or irregular frame.
- Choose the colour from the **client's brand**, not from taste. If the brand has none, derive one strong colour and use a single neutral.
- Keep the layout very simple: headline, one line, one action.
- Check contrast on red and orange: white on `#FF4D00` often fails 4.5:1; use black or darken the colour.

### E. Clean product or proof hero (light)

- Calm near-white or tinted ground, headline at centre or left (a serif, italic or handwritten accent word is the common touch: "Be the *brightest* person in the room"), one primary button.
- Below the actions, a **proof row**: stars and a number ("4.8 across 500+ reviews"), a client logo strip, or two overlapping review cards (`#92`).
- Product, phone or UI mock-up emerges from the bottom edge, partly cropped, to invite scrolling.
- Good for: SaaS, apps, services with a strong rating. Use real screenshots, not stock.

### F. Split layout

- 50/50, 55/45 or 40/60. Text on one side with generous space, the image or graphic bleeds to the viewport edge on the other (`#34 #49 #77`).
- Align the headline's baseline or top to an element in the image. Keep a clear gutter.
- On phones: image first (natural aspect), text below; or text first with the image as a rounded block.
- Very safe for clinics, professional services, retail with a single hero product.

### G. Collage or mosaic

- 4 to 9 images in a grid or scatter, **one** clearly largest, a headline over or beside it.
- Mixed aspect ratios are fine, but align to an underlying 12-column grid. Consistent colour grade across images.
- Good for studios, creatives, shops with several categories. Avoid for businesses that have only a few mediocre photographs.

### H. Functional hero

- The task is the hero: a one-field prompt (`#1`), a search bar (`#15`), a selector (`#83`), a property card (`#17`).
- Headline short, the control large with generous tap targets (at least 48 px), a clear primary label ("Search", "Check availability"), helpful default values, inline validation.
- Combine with A (photo behind) or E (calm ground).

---

## 4. Phone adaptation (design this separately, do not just shrink)

The desktop hero is rarely right on a phone. Choose one:

1. **Photo block then type.** Keep the photograph's **natural shape** across the top (aspect-ratio box) so every subject stays in frame; pull the headline up over its lower edge with a gradient; actions below, in the thumb zone. Best when the photo has two or more important subjects (a clinic's two-person shot).
2. **Full-height portrait crop.** Use a dedicated portrait crop (`<source media="(max-width: 899px)">`), type at the bottom over a scrim. Best when there is a single subject.
3. **Type-led stack.** For archetypes B and D: wordmark or headline fills the width, a short line, actions, then the visual.

Always on phones:
- `min-height` by content or `100svh`, never a fixed pixel height that clips the actions.
- Primary action visible without scrolling; add a **bottom action bar** (Book / Call) that **hides while the hero is on screen** and appears after.
- Menu as a card dropped from the menu button with the same two actions inside, or a full-screen sheet.
- Headline minimum about 2.4rem and no more than 4 lines.
- Check at 360 px, 390 px and 430 px wide, plus a short viewport (320 px tall) in landscape.

---

## 5. Navigation, header and surrounding details

- Small, quiet, 4 to 7 items. A floating pill or an inset bar looks deliberate (`#13 #16 #23 #99`). "Menu" alone is acceptable for creative sites (`#40 #61`).
- Logo left (or centre), primary action as the **only filled button** in the header.
- On photo heroes the header is transparent with light text until scroll.
- Optional extras that appeared often and add polish when real: a top announcement line (`#20 #28`), a ticker or marquee of services (`#28 #77`), a local time or location (`#27 #47`), a slide counter (`#101`), "Scroll" cue (`#45 #47 #65 #101`).
- Cookie banners are **not** part of the hero. If one is needed, make it small and bottom-anchored and never cover the headline or action on a phone (a common failure seen on small-business sites).

---

## 6. Typography quick reference

| Mood | Display | Notes |
|---|---|---|
| Clinical, trustworthy, modern | Neutral grotesk or geometric sans (Figtree, Plus Jakarta, DM Sans, Geist), weight 300 to 600 | Light headline with one bold word; generous spacing |
| Editorial, luxury, hospitality | Refined serif (Cormorant, Playfair, EB Garamond; Fraunces and Instrument Serif are banned as defaults, see `studio-design-taste`), tight tracking, italic accent | Only with a reason; do not default to serif |
| Bold, agency, retail | Heavy grotesk or condensed (Archivo, Anton, Bebas, Inter Tight 800) | Uppercase or sentence case, tight leading |
| Tech, product | Geometric sans + mono labels | Small mono for metadata |
| Playful, youth | Rounded or quirky display, one hand-drawn accent | Keep body plain |

Rules: one family (or one deliberate pair); emphasis by weight, italic or colour in the **same** family; headline tracking `-.03em` to `-.06em`; never centre-justify long body text; body 17 to 18px, line-height 1.6 to 1.7.

---

## 7. Colour quick reference

- **Use the client's colours first** (sample from logo and icons). Invent a palette only when none exists.
- Photo heroes: tint the scrim to the brand's darkest tone; accent for the primary button; white text.
- Flat fields: one saturated colour plus black or white.
- Avoid the premium-beige default and the AI purple glow (see `studio-design-taste`).
- Dark backgrounds in a hero are a **look**. They are not a dark-mode feature and should not add a theme switch unless the user explicitly asks for dark mode.

---

## 8. Build notes (HTML and CSS)

```html
<section class="hero" data-hero>
  <picture class="hero-bg">
    <source media="(max-width: 899px)" srcset="/img/hero-900.webp">
    <img src="/img/hero-1600.webp" alt="Specific description of the photograph"
         width="1600" height="1164" fetchpriority="high">
  </picture>
  <div class="hero-scrim"></div>
  <div class="wrap hero-inner">
    <div class="hero-copy">
      <h1>Get moving without the <b>pain</b></h1>
      <p class="lede">Physiotherapy and sports injury care in Salthill, Galway City.</p>
      <div class="actions">
        <a class="btn btn-light" href="/book">Book online</a>
        <a class="btn btn-ghost" href="tel:+35391581773">Call 091 581 773</a>
      </div>
    </div>
    <aside class="glass" aria-label="Opening hours and address">…</aside>
  </div>
</section>
```

```css
.hero { position: relative; isolation: isolate; display: flex; align-items: flex-end;
        min-height: max(620px, 100svh); margin-top: calc(var(--head) * -1); color: #fff; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; z-index: -2; }
.hero-bg img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 38%; }
.hero-scrim { position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(0deg, rgb(0 10 44 / .92), rgb(0 10 44 / .5) 30%, rgb(0 10 44 / .08) 60%, rgb(0 10 44 / .3)); }
.hero h1 { font-weight: 300; font-size: clamp(2.9rem, 8.4vw, 6.2rem); line-height: .98;
           letter-spacing: -.045em; max-width: 11ch; text-wrap: balance; }
.hero h1 b { font-weight: 700; }
/* phone: natural-shape photo, headline pulled up over its edge */
@media (max-width: 899px) {
  .hero { display: block; min-height: 0; }
  .hero-bg { position: relative; aspect-ratio: 900 / 1048; }
  .hero-inner { margin-top: -6.5rem; }
  .hero-scrim { display: none; }
}
@media (prefers-reduced-motion: no-preference) {
  .hero-bg img { animation: settle 1.6s cubic-bezier(.16, 1, .3, 1) both; }
}
```

- Giant wordmark (B): `font-size: clamp(4rem, 17vw, 17rem); line-height: .85; letter-spacing: -.06em; white-space: nowrap` (fit longer words with a measured `vw` value or a small fit-text script).
- Marquee (optional): duplicate the track, `animation: marquee 30s linear infinite`, pause on `prefers-reduced-motion` and on hover.
- Hide the bottom action bar while the hero is visible with an `IntersectionObserver` on `[data-hero]` (threshold about 0.35).
- Performance: preload the LCP image (separate `media`-matched preloads for the phone and desktop sources), serve WebP or AVIF, give the image `width` and `height`, keep film under 6 MB with a poster.
- Accessibility: one `h1`; meaningful `alt` text describing the actual photograph; focus rings visible on the transparent header; text over images always has a scrim; do not autoplay audio.

---

## 9. Pre-flight checklist (answer every line before shipping the hero)

- [ ] A Hero Read was written and matches the business, audience and assets.
- [ ] Exactly one focal element; nothing competes with it.
- [ ] Headline is 2 to 9 words, specific, with no unprovable superlatives and no dashes.
- [ ] No more than four text elements (headline, line, one or two actions, one small info or proof).
- [ ] The primary action is a clear verb, the only filled button in the header and hero, and matches its label elsewhere.
- [ ] Image or film is at least 1600 px wide, sharp, with a phone-specific crop; every important subject is in frame on a 390 px screen.
- [ ] Scrim or flat ground gives at least 4.5:1 contrast for body text and 3:1 for large text, measured on the real image.
- [ ] Header is readable over the image and solid after scroll.
- [ ] Hero fits `100svh` on desktop, and on a phone the primary action is visible without scrolling.
- [ ] Bottom action bar (phones) hides while the hero is visible.
- [ ] Motion is slow, purposeful, and off under `prefers-reduced-motion`.
- [ ] No cookie banner, popup or chat widget covers the headline or primary action on a phone.
- [ ] No dark-mode switch or `prefers-color-scheme` rules were added (unless the user asked).
- [ ] All facts shown (hours, phone, prices, ratings, claims) come from the client's own material or are flagged for confirmation.
- [ ] LCP image is preloaded, sized and not lazy-loaded.
- [ ] Compared against three references from the 105 (name them by number) and the choice is justified.

---

## 10. Common mistakes and the fix

| Mistake | Fix |
|---|---|
| Picking a layout before reading the assets | Run Step 1 and 2 first; assets decide the archetype. |
| Two focal points (a big photo **and** a big mock-up) | Keep one; demote the other to a small element below the fold. |
| Centred mid-size headline over a busy photo | Left-align, bottom-anchor, add a scrim, or move to a calm area of the photo. |
| Tall cover crop cuts one of two subjects on a phone | Use the photo-block-then-type pattern (Section 4, option 1). |
| Giant headline that wraps to 6 lines on a phone | Shorten the headline; reduce the clamp minimum; use `text-wrap: balance`. |
| White button text on a bright accent | Test contrast; switch to dark text or darken the accent. |
| Autoplaying film with no poster, 20 MB | Compress, add a poster, serve a still on slow connections and reduced motion. |
| Generic stock photo of "people smiling" | Use the client's own photograph; if none, choose an archetype that does not depend on photography (B, D, or an illustration system). |
| Trust row stuffed with invented numbers | Use only real figures the client gives; otherwise show a real review quote or nothing. |
| Dark cinematic style adopted because it "looks premium" for a family dentist | Match the audience: light, warm, calm. Save C for brands that genuinely are theatrical. |
| Adding a theme toggle because the hero is dark | A dark hero is a style. No toggle unless requested. |

---

## 11. Worked examples (how the skill resolves real briefs)

1. **Physio clinic, own photograph of two people at a treatment table, wants bookings.**
   *Hero read: physiotherapy clinic for local adults in pain, archetype A + glass panel, focal = the clinic's own photograph, mood calm-confident, action Book online.*
   Full-bleed photo, navy-tinted scrim, light headline with one bold word, Book online (light pill) and Call (ghost pill), glass card with hours and directions. Phone: photo shown in natural shape across the top, headline pulled over its edge, actions below, bottom bar hidden until the hero scrolls away.
2. **Independent roofing contractor, six job-site photographs, phone leads.**
   *Archetype A or G + brand colour.* Strongest job photograph full-bleed, bold condensed headline ("Roofs that last"), call button in the brand colour as the primary, a small proof line (years in business, real). Phone number tappable in the header.
3. **Wedding and portrait photographer.**
   *Archetype A led by the work, name as wordmark.* Full-bleed portrait, large light serif name bottom-left, "View portfolio" text link, slide counter. No sales language.
4. **Design studio with no client photographs.**
   *Archetype B or D.* Heavy grotesk wordmark filling the width on a flat brand colour, one rotating badge or object, "Scroll" cue.
5. **Hotel with strong photography and a booking engine.**
   *Archetype A + H.* Full-bleed room or terrace, short invitation headline, booking bar (dates, guests, Search) as the primary control.
6. **B2B SaaS with a real product.**
   *Archetype E.* Calm ground, one-line value headline with an italic accent word, one Start button, review stars and logo row, product UI cropped from the bottom.
7. **Local accountant, no photography, wants trust.**
   *Archetype F or E, light.* Left: plain headline and a call-to-book; right: a real portrait of the principal or a clean branded graphic; proof line with a real qualification.

---

## 12. How to apply this skill in a project

1. Read the brief, the client's existing site and assets. Write the **Hero Read**.
2. Pick the archetype with the table in Section 2, then check it against **three** relevant screenshots from the reference folder (look at them; do not rely on memory).
3. Write the content (Section 2, Step 4) before the layout.
4. Build using the spec for that archetype (Section 3) and the phone adaptation (Section 4).
5. Run the pre-flight checklist (Section 9). Screenshot at 390 px and 1440 px. Fix anything that fails.
6. Record the choice (archetype, why, which references) in the project's report or a comment at the top of the page file so the decision can be reviewed.

---

## 13. Vary the hero between sites
When rebuilding several sites in a row, do not repeat the same hero composition, header layout or image treatment (see `website-rebuild-direction`, section 3). Rotate text position (top-left, bottom-left, bottom-right, centred), header (centred logo with split links, logo right, floating pill, overlay menu, utility bar), and buttons (pill, square, uppercase). Full-bleed means the photograph fills the whole first screen (100svh) with the header transparent over it and a separate portrait crop on phones; when the client's photographs are not sharp enough, fetch a free Pexels photograph that tells a true story about the business and log it.
