# Bennhinn Portfolio — Next.js Source

This directory contains the editable React and Next.js version of the Bennhinn Mwangi portfolio.

The published static version is maintained separately in [`../site`](../site). Changes made to this Next.js app do not update the static site automatically.

## Requirements

- Node.js 18.18 or later
- npm

## Getting started

From this directory, install the dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server after a build |
| `npm run check` | Run the TypeScript compiler without emitting files |

## Environment variables

Copy `.env.example` to `.env.local` when you need to configure optional features:

```bash
copy .env.example .env.local
```

On macOS or Linux, use:

```bash
cp .env.example .env.local
```

Available variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SPLINE_SCENE_URL` | Optional Spline code-export URL for the 3D glass key |
| `NEXT_PUBLIC_CV_URL` | Optional verified CV URL used by the Download CV action |
| `RESEND_API_KEY` | API key used by the contact form |
| `CONTACT_TO_EMAIL` | Destination email address for contact submissions |
| `CONTACT_FROM_EMAIL` | Verified sender email address for contact submissions |

Do not commit `.env.local` or API keys. Public variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, so do not put secrets in them.

## Project structure

```text
app/
  page.tsx                 Main page composition
  layout.tsx               Global styles, metadata, and viewport settings
  globals.css              Shared and desktop styling
  hero-mobile.css          Mobile hero styling
  api/contact/route.ts     Contact form API endpoint

components/
  Hero.tsx                 Hero section, navigation, and calls to action
  GlassKey.tsx             Accessible glass-key reveal interaction
  SplineKeyCanvas.tsx      Optional Spline visual layer
  SelectedWork.tsx         Selected work section
  About.tsx                About section
  Creative.tsx             Creative section
  Contact.tsx              Contact section
  projects/                Project showcases and thumbnails
  about/                   About section data and interaction styles
  creative/                Creative section data and interaction styles

public/
  images/                  Portfolio images and hero artwork
  projects/                Project previews and prototypes
```

## Editing the hero

The primary hero markup is in [`components/Hero.tsx`](../source/components/Hero.tsx). Its main styles are in [`app/globals.css`](../source/app/globals.css) and [`app/hero-mobile.css`](../source/app/hero-mobile.css).

The glass-key interaction is implemented in [`components/GlassKey.tsx`](../source/components/GlassKey.tsx). The optional Spline canvas is visual-only; the HTML button and revealed link remain the accessible interaction targets.

## Validation

Before sharing changes, run:

```bash
npm run check
npm run build
```

The project uses the local assets in `public/`. Some external resources, such as Google Fonts and external project links, require an internet connection.
