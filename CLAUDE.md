# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## New Session Setup Instructions

**For Claude Code**: When starting a new session, follow these steps to understand the project context:

### 1. Read Core Documentation

```bash
# Essential files to read for complete context:
- CLAUDE.md                         # This file - development guidance
- docs/project-specifications.md    # Complete technical specifications
- design/pages/*.png               # All UI wireframes (home, product, cart, checkout, etc.)
- design/flows/*.png               # User flow diagrams
```

### 2. Review Current Implementation

```bash
# Explore the entire codebase to understand what's built:
- Browse all project files except design/ and docs/ folders (covered in step 1)
```

## Project Overview

**Project Name**: Next.js Sanity Shopping Site

**Description**: A sophisticated fashion e-commerce platform showcasing modern full-stack development skills. Built as a portfolio project demonstrating advanced React patterns, headless CMS integration, and professional e-commerce features.

**Scope**: Complete e-commerce solution including product catalog, user authentication, shopping cart, checkout process, order management, and admin content management through Sanity CMS.

**Repository**: https://github.com/kaanyurdkl/nextjs-sanity-shopping-site

## Development Essentials

### Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Code Style & Conventions

- Use ES modules (import/export) syntax, not CommonJS
- Destructure imports when possible: `import { client } from '../lib'`
- Follow single responsibility principle
- TypeScript strict mode - all types required
- Path aliases: `@/*` maps to `./src/*`

### Development Workflow

- **IMPORTANT**: Always run `npm run lint` before committing code
- **IMPORTANT**: Test schema changes with example data script
- Prefer editing existing files over creating new ones
- Follow existing patterns in Sanity schemas
- Use TypeScript for all new files

### Tech Stack

- **Core**: Next.js 15.4.1, React 19.1.0, TypeScript, Tailwind CSS v4, Sanity CMS
- **Full details**: See `docs/project-specifications.md` → Technical Architecture

## Current Implementation Status

### ✅ Completed

- Next.js 15 setup with App Router and Turbopack
- Sanity integration with Studio v3
- Product and review schemas with dynamic sizing system
- Example data generation script with JSON separation
- Geist font integration

### 🔄 In Progress

- Creating remaining Sanity schemas (user, order, promotion)
- Frontend component development

### 📋 Next Phase

- Complete all content schemas
- Implement authentication (NextAuth.js + Google OAuth)
- Build core e-commerce functionality

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Homepage (placeholder)
│   ├── globals.css        # Global styles
│   └── studio/            # Sanity Studio integration
├── sanity/                # Sanity CMS configuration
│   ├── schemaTypes/       # Content schemas
│   │   ├── productType.ts # ✅ Product schema with dynamic sizing
│   │   ├── reviewType.ts  # ✅ Customer review schema
│   │   └── index.ts       # Schema registry
│   └── lib/               # Sanity client utilities
scripts/
├── add-example-products.ts # Data generation script
└── example-products.json   # Sample product data
design/                    # UI wireframes organized by page type
├── pages/                 # Individual page wireframes
│   ├── home/             # Homepage designs
│   ├── products/         # Product listing and detail pages
│   ├── account/          # Account management (3-tab design)
│   ├── checkout/         # 3-step checkout flow
│   └── order/            # Confirmation and tracking pages
└── flows/                # User flow wireframes
    └── cart/             # Shopping cart flows
docs/                      # Project documentation
└── project-specifications.md # Complete project specs
```

## References

- **Complete specifications**: `docs/project-specifications.md`
- **UI wireframes**: `design/pages/` and `design/flows/` folders (organized by page type)
- **Notion project**: "Next.js Sanity Shopping Site" for task tracking
