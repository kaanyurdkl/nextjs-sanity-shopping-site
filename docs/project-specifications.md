# E-Commerce Project Specifications

**Fashion E-commerce Platform - Technical Requirements & Design Specifications**  
*Version 3.0 - Updated January 2025*

## Table of Contents

1. [Executive Summary & Overview](#1-executive-summary--overview)
2. [Business Requirements](#2-business-requirements)
3. [Technical Architecture](#3-technical-architecture)
4. [User Experience Specifications](#4-user-experience-specifications)
5. [Feature Specifications](#5-feature-specifications)
6. [Integration Requirements](#6-integration-requirements)
7. [Implementation Guidelines](#7-implementation-guidelines)

---

## 1. Executive Summary & Overview

### Project Vision
A sophisticated fashion e-commerce platform targeting quality-conscious Millennial shoppers in Montreal, Canada. The platform emphasizes minimal design, comprehensive product information, and professional order management.

### Target Audience
**"The Thoughtful Shopper"**
- Demographics: Millennials (26-40 years old)
- Location: Montreal, QC, Canada (Canada-wide shipping)
- Behavior: Research-oriented, value-conscious, quality-focused
- Preferences: Desktop-first, classic fashion, monthly purchasing patterns

### Key Features Overview
- **Advanced Promotion System**: Admin-controlled product tags with bundle deals
- **Professional Order Management**: CLO-2025-XXXXXX numbering system
- **Canadian Compliance**: Provincial tax calculations and address validation
- **Dual User Experience**: Guest checkout + Google OAuth authentication
- **Comprehensive Tracking**: Public order tracking with detailed status updates

---

## 2. Business Requirements

### Design Principles
- **Minimal Aesthetic**: Black, white, and gray color palette exclusively
- **Professional Typography**: Light font weights (300) with strategic white space
- **Desktop-First Responsive**: Optimized for desktop with excellent mobile support
- **Transparent Pricing**: Detailed tax/shipping breakdown for trust building
- **Quality Focus**: Comprehensive product information and customer reviews

### Success Criteria
- Professional appearance matching high-end fashion retailers
- Conversion-optimized checkout process (3-step design)
- Complete order lifecycle management
- Canadian tax compliance across all provinces
- Mobile-responsive design maintaining desktop experience quality

### Business Logic Requirements
- **Promotion Priority System**: Handle multiple promotions with conflict resolution
- **Canadian Tax Calculation**: Real-time provincial tax rates
- **Professional Order Numbering**: Sequential CLO-2025-XXXXXX format
- **Inventory Management**: Variant-based stock tracking (size/color combinations)

---

## 3. Technical Architecture

### Technology Stack

#### Core Dependencies
- **Framework**: Next.js 15.4.1 (App Router) with Turbopack
- **Runtime**: React 19.1.0 with Server Components
- **Language**: TypeScript 5.x with strict mode
- **Styling**: Tailwind CSS v4 with custom properties
- **Fonts**: Geist Sans and Geist Mono via next/font

#### Services & Integrations
- **CMS**: Sanity v3.99.0 for content management
- **Authentication**: Auth.js v5.0.0-beta (Google OAuth only)
- **Payments**: Stripe API (latest 2025 version)
- **Email**: Resend for transactional communications
- **Hosting**: Vercel (free tier deployment)

### Data Architecture (Sanity CMS)

#### Category Hierarchy Structure

The platform uses a flexible hierarchical category system that supports unlimited nesting levels for organized product classification and SEO-friendly URLs.

##### **Key Features:**
- **Flexible Depth**: Categories can be nested to any level (no fixed limit)
- **Parent-Child Relationships**: Each category can optionally reference a parent category
- **Future-Proof**: New categories can be added at any level without structural changes
- **Manual Slug Management**: Admins manually construct hierarchical slugs by extending parent category paths

##### **Current Category Examples:**
- **Root Level**: Men's (`mens`), Women's (`womens`)
- **Nested Examples**:
  - `mens/tops` → `mens/tops/shirts` → `mens/tops/shirts/dress-shirts`
  - `womens/bottoms` → `womens/bottoms/jeans`
  - `womens/dresses` (could expand to `womens/dresses/formal`, etc.)

##### **Category Schema Features:**
- **Manual Slug Construction**: Admins manually create hierarchical slugs by extending parent paths
  - Example: Parent category `mens/tops/shirts` → Child category `mens/tops/shirts/dress-shirts`
  - Process: Admin looks at parent slug and appends current category name
- **Page Type Configuration**: Categories can be product listings or landing pages
- **Flexible Management**: Add, remove, or reorganize categories without code changes
- **Self-Preventing Loops**: Categories cannot reference themselves as parents
- **Slug Field**: Has generate button but is used for manual entry of hierarchical paths

##### **URL Structure Examples**
- **Product URLs**: Use `/product/` prefix with product slug: `/product/luxury-t-shirt`, `/product/executive-dress-shirt`
- **Category URLs**: Follow hierarchical path: `/mens/tops/shirts/dress-shirts`, `/womens/bottoms/jeans`
- Automatic breadcrumb generation from hierarchical slug paths

#### User Collection
```typescript
// User profile management
{
  // Google OAuth integration
  googleId: string
  email: string (read-only)
  firstName: string (editable)
  lastName: string (editable)
  phoneNumber: string (editable, optional)
  
  // Address management
  addresses: Address[] // Multiple saved addresses with isDefault flag
  
  // Account metadata
  isActive: boolean
  orderEmails: boolean // Email preferences
}
```

#### Address Object Type
```typescript
// Reusable address schema for user addresses and order shipping/billing
{
  nickname: string // User-defined name (e.g., "Home", "Office")
  firstName: string
  lastName: string
  streetAddress: string
  aptUnit?: string // Optional apartment/unit
  city: string
  province: 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NT' | 'NS' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT'
  postalCode: string // Canadian format validation
  country: 'Canada' (read-only)
  isDefault: boolean // Default address flag
}
```

#### Product Schema
```typescript
// Enhanced product schema with dynamic sizing
{
  name: string
  slug: slug
  description: blockContent
  basePrice: number
  category: reference // Reference to category schema for hierarchical categorization
  sizeGroup: reference // Reference to size schema for dynamic sizing
  
  // Variant system with auto-generated SKUs
  variants: {
    size: string // Dynamic based on selected size group
    color: reference // Reference to color schema
    sku: string // Auto-generated: PRODUCT-COLOR-SIZE-SEQUENCE
    stockQuantity: number
    isActive: boolean
  }[]
  
  // Content and media
  thumbnail: image
  hoverImage: image
  images: image[]
  keyFeatures: blockContent
  materials: blockContent
  sizeAndFit: blockContent
  careInstructions: blockContent
  relatedProducts: reference[]
  reviews: reference[]
  
  // Status
  isActive: boolean
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
}
```

#### Color Schema
```typescript
// Color schema for product variant management
{
  name: string // Display name (e.g., "Navy Blue", "Forest Green")
  code: string // 3-letter uppercase code for SKU generation (e.g., "NAV", "RED")
  hexCode: string // Hex color code for swatches (e.g., "#FF0000")
}
```

#### Size Schema
```typescript
// Size schema with flexible size groups
{
  name: string // Size group name (e.g., "Letter Sizes", "Waist Sizes")
  sizes: {
    name: string // Display name (e.g., "Medium", "32 Waist")
    code: string // 1-3 char code for SKU generation (e.g., "M", "L", "32")
  }[]
}
```

#### Order Schema
```typescript
// Comprehensive order management
{
  orderNumber: string // CLO-2025-XXXXXX format
  status: 'confirmation' | 'processing' | 'shipped' | 'delivered'
  
  // Customer information
  userId?: reference // For logged-in users
  guestEmail?: string // For guest checkout
  
  // Order items
  items: {
    product: reference
    variant: object
    quantity: number
    basePrice: number
    finalPrice: number // After promotions
    appliedPromotions: reference[]
  }[]
  
  // Financial details
  subtotal: number
  totalDiscount: number
  promoCodeDiscount: number
  shippingCost: number
  taxAmount: number
  grandTotal: number
  
  // Shipping and payment
  shippingAddress: object
  billingAddress: object
  paymentMethod: object // Stripe integration
  trackingNumber?: string
  
  // Timestamps
  createdAt: datetime
  updatedAt: datetime
}
```

#### Promotion Schema
```typescript
// Advanced promotion system with 6 promotion types
{
  name: string
  description: string
  type: 'percentage' | 'fixed_amount' | 'bundle' | 'bogo' | 'tiered' | 'threshold'
  
  // Type-specific configurations (conditional based on type)
  percentageConfig?: { discountPercentage: number }
  fixedAmountConfig?: { discountAmount: number }
  bundleConfig?: { buyQuantity: number, getQuantity: number, bundlePrice: number }
  bogoConfig?: { buyQuantity: number, getQuantity: number, getDiscount: number }
  tieredConfig?: { tiers: { minimumQuantity: number, discountPercentage: number }[] }
  thresholdConfig?: { spendThreshold: number, discountPercentage: number }
  
  // Targeting
  applicableCategories: reference[] // Hierarchical category targeting
  applicableProducts: reference[] // Specific product targeting (optional)
  
  // Visual display
  showTag: boolean
  tagLabel: string // Custom admin-defined text (e.g., "2 FOR $95", "25% OFF")
  tagBackgroundColor: string // Tailwind CSS class
  tagTextColor: string // Tailwind CSS class
  priority: number // 1-100, higher wins for multiple promotions
  
  // Scheduling
  isActive: boolean
  startDate: datetime
  endDate?: datetime
}
```

#### Promo Code Schema
```typescript
// Customer-entered discount codes
{
  name: string
  description?: string
  code: string // Customer-facing code (e.g., "SAVE20", "WELCOME10")
  discountType: 'fixed_amount' | 'percentage'
  discountValue: number
  
  // Optional constraints
  hasMaximumDiscount: boolean
  maximumDiscount?: number
  hasMinimumPurchase: boolean
  minimumPurchase?: number
  hasUsageLimit: boolean
  usageLimit?: number
  
  // Scheduling and tracking
  isActive: boolean
  startDate: datetime
  endDate?: datetime
  usageCount: number // Auto-updated
}
```

### Advanced Promotion System Details

**🏷️ Promotion Engine Overview**

The promotion system is a sophisticated e-commerce engine with **6 different promotion types** and powerful targeting capabilities, designed specifically for Canadian fashion e-commerce.

**🎯 Available Promotion Types:**

1. **Percentage Discount** (`percentage`)
   - Simple percentage off (e.g., "25% OFF")
   - Uses `discountValue` field (0-100)

2. **Fixed Amount Off** (`fixed_amount`)  
   - Dollar amount discount (e.g., "$10 OFF")
   - Uses `discountValue` field (dollar amount)

3. **Bundle Pricing** (`bundle`)
   - Fixed price for multiple items (e.g., "2 FOR $95")
   - Configuration: `buyQuantity`, `getQuantity`, `bundlePrice`

4. **Buy One Get One** (`bogo`)
   - BOGO deals (e.g., "Buy 2 Get 1 Free")
   - Uses same bundle configuration with different logic

5. **Tiered Discount** (`tiered`)
   - Volume discounts: "Buy 3+ get 10% off, Buy 5+ get 20% off"
   - Array of `minimumQuantity` → `discountPercentage` tiers

6. **Spend Threshold** (`threshold`)
   - Minimum spend required (e.g., "Spend $100, Get 15% OFF")
   - Uses `spendThreshold` field

**🎨 Visual Tag System:**
- `tagLabel`: Custom text displayed on products (e.g., "2 FOR $95", "25% OFF")
- `tagBackgroundColor`/`tagTextColor`: Tailwind CSS classes with custom color picker (oklch format)
- `showTag`: Toggle to show/hide promotion tags on products
- **Custom TailwindColorPicker Component**: Admin-friendly color selection with visual preview

**🎯 Product Targeting & Scope:**
- `applicableCategories`: Target specific product categories with hierarchical support
- `applicableProducts`: Target specific product references (optional, filters by selected categories)
- `priority`: Handle conflicts when multiple promotions apply to same products (1-100, higher wins)
- **Hierarchical Targeting**: Select broader categories (e.g., "Men's") to include all subcategories, or specific categories (e.g., "Dress Shirts") for precise targeting

**⚡ Key Business Features:**
- **Automatic Visual Tags**: Promotions display custom-styled tags on product listings
- **Smart Scheduling**: Start/end dates with automatic activation/deactivation
- **Free Shipping Integration**: Optional free shipping inclusion with promotions
- **Usage Analytics**: Track promotion usage counts and total customer savings
- **Admin Control**: Complete control over tag appearance and promotion rules
- **Customer Experience**: Visual tags show deals immediately without requiring codes

This system supports everything from simple percentage discounts to complex bundle deals, making it ideal for fashion e-commerce promotional strategies.

### System Architecture

#### Application Flow
```
User Request → Next.js App Router → Server Components → API Routes
                    ↓
Sanity CMS ← Content Management ← Admin Dashboard (Sanity Studio)
                    ↓
Authentication ← Auth.js v5 ← Google OAuth Provider ← Custom Sign-In Page
                    ↓
Payment Processing ← Stripe API ← Secure Payment Forms
                    ↓
Email Notifications ← Resend API ← Order/Shipping Updates
```

#### Component Interaction
- **Frontend Layer**: Next.js App Router handles routing, Server Components for data fetching
- **Content Layer**: Sanity CMS provides headless content management with real-time updates
- **Authentication Layer**: NextAuth.js manages OAuth sessions with Google provider integration
- **Payment Layer**: Stripe handles secure payment processing with webhook integration
- **Communication Layer**: Resend manages transactional emails with template system
- **Hosting Layer**: Vercel provides CDN, edge functions, and automatic deployments

#### Data Flow Architecture
1. **Content Creation**: Admins create/edit content in Sanity Studio
2. **Content Delivery**: Next.js fetches content via Sanity client with CDN caching
3. **User Authentication**: Google OAuth flow creates/manages user sessions
4. **Order Processing**: Shopping cart → Checkout → Stripe payment → Order confirmation
5. **Email Automation**: Order events trigger email notifications via Resend
6. **Real-time Updates**: Sanity webhooks enable live content updates

---

## 4. User Experience Specifications

### Page Structure & Navigation

#### Homepage (`/`)
- **Hero Section**: Minimal design with "SHOP WOMEN'S" and "SHOP MEN'S" CTAs
- **Featured Products**: Curated product grid with hover effects
- **Value Propositions**: Premium materials, timeless design, satisfaction guarantee

#### Category Landing Pages
- **Men's/Women's Landing Pages**: `/mens`, `/womens` (category landing pages with navigation and featured content)

#### Product Listing Pages  
- **Category Pages**: 
  - Men's: `/mens/tops`, `/mens/bottoms`, `/mens/tops/shirts`
  - Women's: `/womens/tops`, `/womens/bottoms`, `/womens/dresses`
- **Subcategory Pages**:
  - `/mens/tops/shirts/dress-shirts`, `/mens/tops/shirts/casual-shirts`
  - `/womens/bottoms/jeans`, `/womens/tops/blouses`
- **Special Collections**: 
  - `/deals` (promotion-tagged products)
  - `/new-arrivals` (recently added products)
  - `/essentials` (core wardrobe pieces)

#### Product Detail Page (`/product/[slug]`)
- **Image Gallery**: Primary + hover image + additional gallery
- **Product Information**: Name, price, rating, description
- **Variant Selection**: Size/color options based on productType
- **Add to Cart**: Quantity selector and size guide
- **Product Tabs**: Description, Key Features, Materials, Size & Fit, Care Instructions
- **Reviews Section**: Customer reviews with ratings and verification badges
- **Related Products**: Recommendation carousel

#### Shopping Cart (`/cart`)
- **Item Management**: Quantity adjustment, removal, save for later
- **Promotion Display**: Bundle deals with savings indicators
- **Price Breakdown**: Subtotal, discounts, shipping preview
- **Promo Code Input**: Single code application
- **Checkout CTA**: Clear progression to checkout

### Account Management (`/account`)

#### Three-Tab Sidebar Design
1. **Profile Tab (Default)**
   - View/Edit mode toggle for personal information
   - Account creation date display
   - Clean form design with Google OAuth email handling

2. **Orders Tab**
   - Visual order list with product images (max 3 per order)
   - Order status indicators with colored dots
   - Track/View Details buttons for each order
   - Professional order numbering display

3. **Addresses Tab**
   - Saved address cards with custom naming
   - Default address badge system
   - Add/Edit/Delete address functionality
   - Canadian postal code validation

### Order Tracking System

#### Public Tracking Pages
- **Track Landing** (`/track`): Simple order number search
- **Track Results** (`/track/[orderNumber]`): Detailed status timeline
- **Status Indicators**: Color-coded progress with timestamps
- **Cross-tracking**: Ability to search additional orders

---

## 5. Feature Specifications

### E-commerce Core Features

#### Shopping Cart System
- **Persistent Cart**: Maintains state across sessions
- **Quantity Management**: Increment/decrement with stock validation
- **Variant Tracking**: Individual SKU-based inventory
- **Price Updates**: Real-time calculation with promotions

#### Checkout Process (3-Step Design)
**Step 1: Contact Information**
- Guest checkout: Email collection only
- User checkout: Pre-filled from account

**Step 2: Shipping Information**
- Address collection with Canadian postal code validation
- Billing address option ("Same as shipping" default)
- Shipping method selection (Standard/Express)
- Real-time tax calculation

**Step 3: Payment Information**
- Stripe integration (Credit Card, PayPal)
- No saved payment methods (fresh entry for security)
- Order review with complete pricing breakdown
- Secure order placement

### Advanced Promotion System

#### Promotion Types
1. **Percentage Discounts**: "Selected Jeans 25% Off"
2. **Bundle Pricing**: "2 FOR $95" with percentage savings
3. **BOGO Deals**: "Buy 2 Get 1 Free"
4. **Tiered Discounts**: "Buy More, Save More"
5. **Spend Thresholds**: "Spend $200+, Get 15% Off"

#### Admin Controls
- **Custom Tag Labels**: Admin-defined promotion text
- **Tag Styling**: Background and text color control
- **Gender Assignment**: Men's vs women's deals pages
- **Priority System**: Conflict resolution for multiple promotions

### Order Management System

#### Order Status Lifecycle
1. **Order Confirmation**: Payment processing complete
2. **Processing**: Order preparation (1-2 business days)
3. **Shipped**: Package dispatched with tracking
4. **In Transit**: Location-based delivery tracking
5. **Out for Delivery**: Local carrier assignment
6. **Delivered**: Final delivery confirmation
7. **Delayed/Exception**: Issue handling

#### Professional Features
- **Order Numbering**: CLO-2025-XXXXXX sequential format
- **Public Tracking**: No authentication required
- **Email Communications**: Automated status updates
- **Account Integration**: Order history for logged-in users

---

## 6. Integration Requirements

### Authentication (Auth.js v5)
- **Google OAuth Only**: Simplified authentication strategy with offline access tokens
- **Custom Sign-In Page**: Professional UI matching brand design at `/signin`
- **Route Protection**: Middleware-based authentication protecting `/account` pages
- **Automatic Account Creation**: New users created during OAuth flow
- **Guest Checkout Support**: No authentication required for shopping/checkout
- **Session Management**: JWT-based secure token handling with automatic refresh
- **Clean Architecture**: Separate auth configuration and provider setup

#### Authentication Implementation Details

**File Organization:**
```
src/lib/auth/
├── config.ts      # Auth.js configuration (pages, callbacks)
└── index.ts       # Main auth setup with Google provider

src/app/signin/
└── page.tsx       # Custom sign-in page (no navbar)

src/components/
├── navbar.tsx     # Authentication-aware navigation
└── icons/
    └── google-icon.tsx # Reusable Google OAuth icon
```

**Key Features Implemented:**
- **Custom Sign-In Page**: Clean, branded UI at `/signin` with Google OAuth button
- **Route Groups**: `(main)` layout includes navbar, auth pages excluded
- **Middleware Protection**: `/account` routes require authentication
- **Server Components**: Navbar and layout use server-side session checking
- **Google OAuth Configuration**: Includes `prompt: "consent"` and `access_type: "offline"`
- **Automatic Redirects**: Users redirected back to intended page after sign-in
- **Icon Components**: Reusable Google icon with proper branding colors

### Payment Processing (Stripe)
- **Secure Integration**: Latest Stripe API version
- **Payment Methods**: Credit cards, PayPal support
- **Canadian Compliance**: Provincial tax integration
- **PCI Compliance**: Minimal sensitive data storage

### Email System (Resend)
- **Transactional Emails**: Order confirmation, shipping updates
- **Template System**: Consistent branding
- **Guest User Support**: Email-only communication
- **Demo Simulation**: Portfolio-appropriate email handling

### Canadian Tax Integration
```javascript
// Provincial tax rates
const TAX_RATES = {
  'QC': { GST: 0.05, QST: 0.09975 }, // 14.975%
  'ON': { HST: 0.13 },               // 13%
  'BC': { GST: 0.05, PST: 0.07 },   // 12%
  'AB': { GST: 0.05 },              // 5%
  // Additional provinces...
}
```

---

## 7. Implementation Guidelines

### Development Workflow
1. **Schema-First Development**: Complete Sanity schemas before frontend
2. **Component-Based Architecture**: Reusable UI components
3. **Type-Safe Development**: TypeScript strict mode
4. **Testing Strategy**: Schema validation and data integrity
5. **Performance Optimization**: Image optimization, lazy loading

### Quality Standards
- **Code Style**: ES modules, TypeScript strict mode
- **Design System**: Consistent spacing, typography, colors
- **Accessibility**: WCAG compliance for inclusive design
- **Performance**: Core Web Vitals optimization
- **SEO**: Structured data, meta tags, clean URLs

### Content Management
- **Admin Experience**: Intuitive Sanity Studio interface
- **Content Validation**: Required fields and data integrity
- **Media Management**: Optimized image handling
- **Preview System**: Content preview before publishing

### Security Requirements
- **Payment Security**: PCI-compliant data handling
- **User Privacy**: GDPR-compliant data structure
- **Authentication**: Secure OAuth implementation
- **Data Protection**: Minimal sensitive information storage

### Deployment Strategy
- **Hosting**: Vercel free tier deployment
- **Environment Management**: Separate dev/staging/production
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Handling**: Comprehensive logging and monitoring

---

## Price Calculation System

### Calculation Flow
```javascript
// Step-by-step pricing logic
1. Base Cart Subtotal = Σ(product.basePrice × quantity)
2. Apply Promotion Discounts (automatic)
3. Apply Promo Code Discount (user-entered)
4. Calculate Shipping Cost (free if subtotal ≥ $150)
5. Calculate Tax (provincial rates on taxable amount)
6. Grand Total = Subtotal - Discounts + Shipping + Tax
```

### Display Format
```
Line Items:
Oxford Shirt (2 FOR $95): $47.50 (was $60.00)
Chino Pants (2 FOR $95): $47.50 (was $60.00)

Order Summary:
Subtotal: $120.00
Promo Code (SAVE15): -$15.00
Total Discount: -$40.00
Shipping: FREE
Tax (QC): $9.74
────────────────────
Total: $89.74

💰 You saved $40.00 today!
```

---

*This document serves as the complete technical and business specification for the e-commerce platform development. All implementation should reference these specifications for consistency and completeness.*