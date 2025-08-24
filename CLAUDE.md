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
- Keep code and documentation clean, technical, and simple
- Avoid emojis, icons, or fancy formatting in comments and documentation
- Use concise, descriptive technical language for file and function descriptions

### Type File Conventions

- Type files use `.types.ts` suffix (e.g., `components.types.ts`, `tailwind.types.ts`)
- Always use explicit `type` keyword when importing types: `import type { CustomStringOptions } from "../types/components.types"`
- Organize types in `/types/` folder with descriptive domain-based naming

### Development Workflow

- **IMPORTANT**: Always run `npm run lint` before committing code
- **IMPORTANT**: Test schema changes with example data script
- **IMPORTANT**: Use minimal commit messages (e.g., "Remove marketingEmails field from user schema")
- Prefer editing existing files over creating new ones
- Follow existing patterns in Sanity schemas
- Use TypeScript for all new files

### Tech Stack

- **Core**: Next.js 15.4.1, React 19.1.0, TypeScript, Tailwind CSS v4, Sanity CMS
- **Full details**: See `docs/project-specifications.md` → Technical Architecture

## Current Implementation Status

### Completed

- Next.js 15 setup with App Router and Turbopack
- Sanity integration with Studio v3
- Sanity schema structure (11 schemas total)
- Product catalog with sample data
- Custom Sanity components for admin workflow

### Next Phase

- **Frontend development** (homepage, product pages, cart, checkout)
- Implement authentication (NextAuth.js + Google OAuth)
- Build shopping cart and checkout functionality
- Integrate Stripe payment processing
- Connect Sanity schemas to frontend components
- Implement promotion engine and pricing calculations

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── globals.css        # Global styles
│   ├── (main)/            # Route group with navbar
│   │   ├── layout.tsx     # Main layout with navbar and auth provider
│   │   ├── page.tsx       # Homepage
│   │   └── account/       # Protected account pages
│   │       └── page.tsx   # Account dashboard
│   ├── signin/            # Authentication pages (no navbar)
│   │   └── page.tsx       # Custom sign-in page with Google OAuth
│   ├── studio/            # Sanity Studio integration
│   │   └── [[...tool]]/   # Sanity Studio catch-all route
│   │       └── page.tsx   # Studio page
│   └── api/               # API routes
│       └── auth/          # Auth.js API routes
│           └── [...nextauth]/
│               └── route.ts # Auth.js handlers
├── components/            # Reusable UI components
│   ├── navbar.tsx         # Navigation with auth states
│   ├── auth-provider.tsx  # SessionProvider wrapper
│   └── icons/             # Icon components
│       ├── google-icon.tsx # Google OAuth icon
│       └── index.ts       # Icon exports
├── lib/                   # Utilities and configurations
│   └── auth/              # Authentication setup
│       ├── config.ts      # Auth.js configuration
│       └── index.ts       # Main auth setup with Google provider
├── middleware.ts          # Route protection middleware
├── sanity/                # Sanity CMS configuration
│   ├── schemaTypes/       # Content schemas (11 total)
│   │   ├── documents/     # Document types (top-level content)
│   │   │   ├── productType.ts # Product schema with dynamic sizing and SKU generation
│   │   │   ├── categoryType.ts # Category schema for hierarchical categorization
│   │   │   ├── colorType.ts   # Color schema for product variants
│   │   │   ├── sizeType.ts    # Size schema with flexible size groups
│   │   │   ├── reviewType.ts  # Customer review schema with verification
│   │   │   ├── userType.ts    # User schema with Google OAuth integration
│   │   │   ├── orderType.ts   # Order schema with CLO-2025-XXXXXX numbering
│   │   │   ├── promoCodeType.ts # Promo code schema with usage tracking
│   │   │   └── promotion/     # Advanced promotion system
│   │   │       └── index.ts   # Main promotion schema with 6 types
│   │   ├── objects/       # Object types (embedded content)
│   │   │   ├── addressType.ts # Reusable address schema for shipping/billing
│   │   │   └── blockContentType.ts # Rich text content schema
│   │   └── index.ts       # Schema registry
│   ├── lib/               # Sanity client utilities
│   │   ├── client.ts      # Sanity client configuration
│   │   ├── image.ts       # Image URL builder utilities
│   │   └── live.ts        # Live content functionality
│   ├── components/        # Custom Sanity components
│   │   ├── TailwindColorPicker.tsx # Color picker for promotion tags
│   │   ├── DynamicSizeInput.tsx    # Dynamic size selection based on size group
│   │   └── ComputedSkuInput.tsx    # Auto-generated SKU computation
│   ├── types/             # Type definitions
│   │   ├── components.types.ts # Component-related types
│   │   ├── tailwind.types.ts   # Tailwind-related types
│   │   ├── sanity.types.ts     # Generated Sanity types
│   │   └── schema.json         # Generated schema
│   ├── constants/         # Shared constants
│   │   └── tailwind.ts    # Tailwind-related constants
│   ├── config/            # Configuration files
│   │   ├── env.ts         # Environment variables
│   │   └── structure.ts   # Studio structure configuration
│   └── queries/           # GROQ queries (ready for use)
scripts/
├── add-products.ts         # Creates products and adds to Sanity
├── delete-products.ts      # Deletes all products from Sanity
├── example-products.json   # 13 complete products with variants
└── shared/                 # Shared utilities
    └── sanity-utils.ts     # Sanity client config and image processing
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
