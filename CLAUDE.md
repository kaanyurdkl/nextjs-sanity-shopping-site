# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a sophisticated fashion e-commerce website project showcasing cutting-edge full-stack development skills. The project targets "The Thoughtful Shopper" (Millennials 26-40) in Montreal, Canada, with a minimal black, white, and gray aesthetic.

**Project Type**: Fashion/Apparel E-commerce Website (Portfolio Project)
**Status**: 80% Complete - Product/review schemas done, remaining schemas in progress
**Repository**: https://github.com/kaanyurdkl/nextjs-sanity-shopping-site

## New Session Setup Instructions

**For Claude Code**: When starting a new session, follow these steps to understand the project context:

### 1. Read Project Documentation
```bash
# Essential files to read for complete context:
- design/project-report.md      # Complete project specifications & requirements
- design/*.png                 # All UI wireframes (home, product, cart, checkout, account, etc.)
```

### 2. Check Notion Project Status
- **Project Name**: "Next.js Sanity Shopping Site"  
- **Actions to take**:
  - Review the main project page and current task status
  - Read the complete project charter document (comprehensive technical specs)
  - Check the databases page to understand data structure
  - Review task progress (currently: Sanity schema creation in progress)

### 3. Current Development Status
- ✅ **Completed**: Next.js setup, Sanity integration, basic project structure
- ✅ **Completed**: Product and review schemas with variant-based inventory system
- 🔄 **In Progress**: Creating remaining Sanity schemas (promotion, user, order, etc.)
- 📋 **Next Phase**: Complete all content schemas, implement frontend components

### 4. Key Project Features
- **Advanced Promotion System**: Admin-controlled tags, bundle deals ("2 FOR $95")
- **User Management**: Google OAuth + guest checkout, multiple address management  
- **Order System**: Professional numbering (CLO-2025-XXXXXX), comprehensive tracking
- **Canadian Compliance**: Provincial tax calculations, address validation
- **Account Dashboard**: 3-tab design (Profile, Orders, Addresses)
- **Design**: Minimal black/white/gray aesthetic, desktop-first responsive

### 5. Sanity Data Architecture
- **User Collection**: OAuth integration, profile management, address system
- **Product Collection**: Variants, pricing, promotion integration
- **Order Collection**: Guest + user orders, complete order lifecycle
- **Promotion Collection**: Advanced promotion system with admin controls

## Development Commands

- `npm run dev` - Start development server with Turbopack (Next.js 15 experimental)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture

### Tech Stack (Latest 2025 Versions)
- **Framework**: Next.js 15.4.1 (App Router) with Turbopack
- **Runtime**: React 19.1.0 with Server Components
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4.1 with Oxide engine (5x faster builds)
- **CMS**: Sanity Studio v4 for content management
- **Authentication**: NextAuth.js v4.24.11 with Google OAuth only
- **Payments**: Stripe API (latest version 2025-06-30.basil)
- **State Management**: TanStack Query 5.83.0 + Zustand 5.0.6
- **Email**: Resend for transactional emails
- **Mapping**: Mapbox GL JS for delivery visualization
- **Fonts**: Geist Sans and Geist Mono via next/font
- **Linting**: ESLint with Next.js TypeScript configuration
- **Hosting**: Vercel (free tier)

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles with Tailwind imports
  - `studio/` - Sanity Studio integration
- `src/sanity/` - Sanity CMS configuration
  - `schemaTypes/` - Content schemas (productType, reviewType, etc.)
  - `lib/` - Sanity client and utilities
  - `env.ts` - Environment configuration
- `design/` - Complete project documentation and wireframes
  - `project-report.md` - Full project specifications
  - `*.png` - UI wireframes for all pages
- TypeScript configuration uses path aliases (`@/*` maps to `./src/*`)

### Styling Approach
- Tailwind CSS v4 with inline theme configuration
- CSS custom properties for theming (light/dark mode support)
- Geist font family integration

## Claude Code Configuration

Claude Code supports multiple configuration files with different scopes and purposes:

### Configuration Files

1. **`~/.claude/settings.json`** (User-level, global)
   - Applies to all projects
   - Use for: Default model preferences, global permissions, MCP servers
   - Example: Set preferred AI model, allow common commands like `git status`

2. **`.claude/settings.json`** (Project-level, shared)
   - Version controlled, shared with team
   - Use for: Project-specific permissions, environment variables, team workflows
   - Example: Allow project-specific commands, define build hooks

3. **`.claude/settings.local.json`** (Project-level, personal)
   - Git-ignored, personal preferences only
   - Use for: Personal API keys, local debugging, workflow overrides
   - Example: Personal tokens, local development flags

### Settings Precedence (highest to lowest)
1. Enterprise policies
2. Command line arguments
3. Local project settings (`.claude/settings.local.json`)
4. Shared project settings (`.claude/settings.json`)
5. User settings (`~/.claude/settings.json`)

### Common Configuration Options
- `permissions`: Allow/deny specific tool usage
- `env`: Environment variables
- `model`: AI model selection
- `hooks`: Custom commands for workflow integration
- `mcpServers`: Model Context Protocol server configurations

## Notes

- Project uses Next.js 15 with experimental Turbopack for development
- ESLint configuration uses flat config format (eslint.config.mjs)
- TypeScript configured with strict mode and Next.js optimizations
- No testing framework currently configured
- ✅ Sanity integration completed with Studio v4
- 🔄 Currently implementing comprehensive Sanity schemas
- Custom component library approach (avoiding shadcn/ui for pixel-perfect design control)
- Professional order numbering system and Canadian tax compliance built-in

## Quick Context Reminder

This is a **production-ready e-commerce portfolio project** with:
- Comprehensive wireframes and detailed specifications in `/design` folder
- Active project management in Notion with task tracking
- Advanced promotion system with admin-controlled product tags
- Modern tech stack showcasing 2025 best practices
- Minimal, professional design aesthetic targeting quality-conscious shoppers