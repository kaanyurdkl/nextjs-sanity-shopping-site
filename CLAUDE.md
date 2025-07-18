# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project with TypeScript and Tailwind CSS. It's intended to be a shopping site that will integrate with Sanity CMS. Currently, it's a fresh Next.js application created with `create-next-app`.

## Development Commands

- `npm run dev` - Start development server with Turbopack (Next.js 15 experimental)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 (latest)
- **Fonts**: Geist Sans and Geist Mono via next/font
- **Linting**: ESLint with Next.js TypeScript configuration

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles with Tailwind imports
- TypeScript configuration uses path aliases (`@/*` maps to `./src/*`)

### Styling Approach
- Tailwind CSS v4 with inline theme configuration
- CSS custom properties for theming (light/dark mode support)
- Geist font family integration

## Notes

- Project uses Next.js 15 with experimental Turbopack for development
- ESLint configuration uses flat config format (eslint.config.mjs)
- TypeScript configured with strict mode and Next.js optimizations
- No testing framework currently configured
- No Sanity integration implemented yet