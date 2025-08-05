# E-Commerce Project Specifications

**Fashion E-commerce Platform - Technical Requirements & Design Specifications**  
*Version 2.7 - Updated July 16, 2025*

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
- **Authentication**: NextAuth.js v4.24.11 (Google OAuth only)
- **Payments**: Stripe API (latest 2025 version)
- **Email**: Resend for transactional communications
- **Hosting**: Vercel (free tier deployment)

### Data Architecture (Sanity CMS)

#### Product Catalog Structure

##### Men's Collection (`category: 'mens'`)

**Shirts & Tops (`productType: 'shirts'`)**
- Dress Shirts, Casual Shirts, Polo Shirts, Sweaters, T-Shirts
- **Sizes**: XS, S, M, L, XL, XXL

**Pants & Bottoms (`productType: 'pants'`)**
- Dress Pants, Casual Pants, Jeans, Shorts
- **Sizes**: 28, 30, 32, 34, 36, 38, 40 (waist measurements)

**Outerwear (`productType: 'outerwear'`)**
- Blazers, Jackets, Coats, Cardigans
- **Sizes**: XS, S, M, L, XL, XXL

##### Women's Collection (`category: 'womens'`)

**Shirts & Tops (`productType: 'shirts'`)**
- Blouses, Sweaters, T-Shirts, Tops, Knitwear
- **Sizes**: XS, S, M, L, XL, XXL

**Pants & Bottoms (`productType: 'pants'`)**
- Trousers, Jeans, Skirts, Shorts
- **Sizes**: 28, 30, 32, 34, 36, 38, 40 (waist measurements)

**Outerwear (`productType: 'outerwear'`)**
- Blazers, Jackets, Coats, Cardigans
- **Sizes**: XS, S, M, L, XL, XXL

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

#### Product Collection
```typescript
// Enhanced product schema
{
  name: string
  slug: slug
  description: blockContent
  basePrice: number
  category: 'mens' | 'womens'
  productType: 'shirts' | 'pants' | 'outerwear' // Determines sizing
  subcategory?: string // Optional: dress-shirts, casual-shirts, trousers, jeans, etc.
  
  // Variant system
  variants: {
    size: string // Dynamic based on productType
    color: string
    sku: string
    stockQuantity: number
    isActive: boolean
  }[]
  
  // Promotion integration
  promotions: reference[] // Links to active promotions
  
  // Media and content
  thumbnail: image
  hoverImage: image
  images: image[]
  reviews: reference[] // Customer reviews
}
```

#### Order Collection
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

#### Promotion Collection
```typescript
// Advanced promotion system
{
  name: string
  type: 'percentage' | 'bundle' | 'bogo' | 'tiered' | 'threshold'
  
  // Admin-controlled display
  tagLabel: string // Custom admin-defined text
  tagBackgroundColor: string
  tagTextColor: string
  showTag: boolean
  
  // Targeting
  gender: 'mens' | 'womens'
  applicableProducts: reference[]
  priority: number // For conflict resolution
  
  // Configuration
  discountValue: number
  minimumQuantity?: number
  maximumDiscount?: number
  
  // Status
  isActive: boolean
  startDate: datetime
  endDate: datetime
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
- `gender`: Apply to Men's, Women's, or Both categories
- `applicableProducts`: Target specific product references
- `applicableCategories`: Target product categories (shirts, pants, outerwear)
- `requiresPromoCode`: Optional promo code requirement with usage limits
- `priority`: Handle conflicts when multiple promotions apply to same products
- `stackable`: Control whether promotions can be combined

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
Authentication ← NextAuth.js ← Google OAuth Provider
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

#### Product Listing Pages
- **Men's/Women's Collections**: `/men`, `/women`
- **Category Pages**: 
  - Men's: `/men/shirts`, `/men/pants`, `/men/outerwear`
  - Women's: `/women/shirts`, `/women/pants`, `/women/outerwear`
- **Subcategory Pages**:
  - `/men/shirts/dress-shirts`, `/men/shirts/casual-shirts`, `/men/shirts/sweaters`
  - `/women/pants/trousers`, `/women/pants/jeans`, `/women/pants/skirts`
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

### Authentication (NextAuth.js)
- **Google OAuth Only**: Simplified authentication strategy
- **Automatic Account Creation**: New users during OAuth flow
- **Guest Checkout Support**: No authentication required
- **Session Management**: Secure token handling

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