# Complete E-Commerce Project Summary Report
**Final Design Specifications with SEO-Optimized URL Structure & Complete Data Architecture - Updated July 16, 2025 v2.7**

## Project Overview
**Project Type:** Fashion/Apparel E-commerce Website (Portfolio Project)  
**Target:** Modern, production-ready application showcasing cutting-edge full-stack development skills  
**Domain:** Free Vercel default domain (your-project.vercel.app)  
**Timeline:** Portfolio development project  

## Target Audience & Design Strategy
**Target Customer:** "The Thoughtful Shopper"
- **Demographics:** Millennials (26-40 years old)
- **Geographic:** Located in Montreal, QC, Canada (with Canada-wide shipping)
- **Shopping Behavior:** Research-oriented, value-conscious, quality-focused
- **Device Preference:** Desktop-first with mobile compatibility
- **Fashion Style:** Classic, timeless pieces over fast fashion trends
- **Shopping Frequency:** Monthly buyers with careful consideration
- **Price Sensitivity:** Willing to pay for quality, but bargain-conscious

**Design Principles:**
- **Minimal aesthetic** - black, white, and gray color palette only
- Clean, sophisticated typography with light font weights (300)
- Strategic use of white space throughout the interface
- Detailed product information and comprehensive reviews
- Transparent pricing with detailed tax/shipping breakdown
- Professional, trustworthy appearance
- Desktop-optimized layouts with excellent mobile support

## Technology Stack (Latest July 16, 2025 Versions - UPDATED)

### **Core Framework & Runtime**
- **Next.js**: **15.4.1** (latest stable - July 15, 2025) with Turbopack builds, 100% integration test compatibility, and stability improvements
- **React**: **19.1.0** (latest stable - March 28, 2025) with Actions, useActionState, useOptimistic, ref as props, and Server Components
- **TypeScript**: Latest stable version
- **Tailwind CSS**: **v4.1** (latest) with text shadows, masks, improved browser compatibility, and 5x faster builds with Oxide engine

### **UI Components & State Management**
- **shadcn/ui**: Latest version with full Tailwind v4 and React 19 support
- **Zustand**: **5.0.6** (latest stable) - confirmed as the "sweet spot" for most teams in 2025
- **TanStack Query**: **5.83.0** (latest - July 12, 2025) - stable suspense support, simplified API

### **Backend & Services**
- **Sanity.io**: **Studio v4** (launched July 15, 2025) with Node.js 20+ requirement, new App SDK, Functions, Agent Actions, and Dashboard
- **NextAuth.js**: **v4.24.11** (stable for production) - **Google OAuth ONLY** (v5 still in beta)
- **Stripe**: API version **2025-06-30.basil** (latest), Node.js SDK **18.2.1** (latest)
- **Email Service**: Resend
- **Hosting**: Vercel (Free Tier)
- **Mapping**: **Mapbox GL JS** (latest) - for delivery location visualization

### **Browser Support & Performance**
- **Tailwind v4**: Requires Safari 16.4+, Chrome 111+, Firefox 128+ with graceful degradation
- **Performance**: Up to 10x faster builds with Tailwind v4, 100x faster incremental builds
- **New Features**: Text shadows, masks, improved old browser compatibility

## Complete Sanity Data Architecture

### **Sanity Collections Overview**
**Unified content and data management approach using Sanity.io for all application data including users, orders, products, and promotions.**

### **User Collection**
**Comprehensive user management supporting both Google OAuth and guest checkout scenarios:**

**User Profile Management:**
- Google OAuth integration with unique identifier storage
- Editable profile information (full name, phone number)
- Read-only email address from Google account
- Account creation timestamp tracking

**Address Management System:**
- Multiple saved addresses with custom naming ("Home Address", "Work Office")
- Default address designation with system badges
- Complete Canadian address format support
- Required phone numbers for all addresses
- Address validation for postal codes and provinces

**Simplified Communication Strategy:**
- Default email address from Google OAuth for all order communications
- Transactional emails for order updates (confirmation, shipping, delivery)
- No complex preference management for portfolio demo application
- Email functionality simulated for demonstration purposes

### **Order Collection**
**Comprehensive order management supporting both guest and logged-in user transactions:**

**Order Identification & Status:**
- Professional order numbering system (CLO-2025-XXXXXX format)
- Complete order status lifecycle tracking
- Support for both user-linked and guest orders
- Order placement timestamp and history tracking

**Order Items Management:**
- Product references linking to Sanity product collection
- Quantity, size, and color variant tracking
- Base price and final price storage (before/after promotions)
- Applied promotion references for accurate pricing history

**Financial Information:**
- Detailed order summary with subtotal calculations
- Total discount tracking from promotions
- Promo code discount applications
- Shipping cost calculations based on location
- Canadian tax compliance with provincial rates
- Grand total with complete pricing breakdown

**Address & Shipping Information:**
- Complete shipping address storage
- Billing address with "same as shipping" option support
- Shipping method selection (Standard vs Express)
- Estimated delivery timeframes
- Estimated delivery date ranges

**Payment & Security:**
- Secure payment method storage (type and last 4 digits only)
- Stripe Payment Intent ID for verification
- Payment timestamp tracking
- No sensitive payment information stored

**Order Tracking System:**
- Tracking number and carrier information
- Direct tracking URL integration
- Order history with status change timestamps
- Administrative notes for order management

### **Product Collection (Enhanced)**
**Advanced product management with promotion integration:**

**Core Product Information:**
- Product names and base pricing
- Category assignment (men's vs women's collections)
- Product variant management (color, size, SKU combinations)
- Product image storage and management

**Promotion Integration:**
- Multiple promotion assignment capability
- Promotion priority handling for conflict resolution
- Dynamic pricing calculation based on active promotions
- Gender-specific promotion targeting

### **Promotion Collection (Advanced)**
**Comprehensive promotion system with admin control:**

**Visual Promotion Management:**
- Custom promotion labels and messaging
- Admin-controlled tag colors (background and text)
- Gender-specific promotion assignment
- Priority-based promotion conflict resolution

**Promotion Types Support:**
- Percentage discount promotions
- Fixed bundle price promotions (2 FOR $95)
- Buy X Get Y promotions (BOGO deals)
- Tiered quantity discounts
- Spend threshold promotions
- Cross-category promotion support

**Administrative Controls:**
- Active/inactive promotion status
- Promotion effectiveness tracking
- Campaign-specific promotion management
- Real-time promotion application

### **Data Relationships & Integration**

**User-Order Relationships:**
- Direct user references for logged-in user orders
- Guest email storage for guest checkout orders
- Order history accessible through user accounts
- Guest order tracking via email and order number

**Product-Promotion Integration:**
- Dynamic promotion application based on product assignments
- Real-time pricing calculations
- Promotion tag display on product cards
- Bundle promotion handling across multiple products

**Order-Product Relationships:**
- Complete product information preservation in orders
- Promotion snapshots for pricing history
- Variant-specific information storage
- Inventory impact tracking capabilities

### **Security & Privacy Considerations**

**Payment Security:**
- PCI compliance through limited data storage
- Stripe integration for sensitive payment processing
- Last 4 digits only for user reference
- Payment Intent ID for verification purposes

**User Privacy:**
- GDPR-compliant data structure
- Granular notification preferences
- Google OAuth for secure authentication
- No password storage requirements

**Guest User Protection:**
- Email-only identification for guest orders
- Order tracking via public URLs
- No unnecessary data collection
- Privacy-focused order management

## Account Management System - UPDATED DESIGN

### **Account Dashboard** (`/account`) - **3-TAB SIDEBAR DESIGN** 
**Streamlined account management with focused functionality:**

#### **Profile Tab (Default Selected)**
**Clean view/edit state pattern for personal information management:**

**Personal Information Card:**
- **View Mode (Default):**
  - Plain text display for all fields - no input styling
  - Clear visual hierarchy with labels and values
  - Single "Edit" button for entire card
  - Clean, scannable information display
  
- **Edit Mode (When Edit clicked):**
  - **Full Name**: Editable input field (user can customize display name)
  - **Email Address**: Grayed out input field (read-only, managed by Google Account)
  - **Phone Number**: Editable input field (user-provided data)
  - **Save/Cancel buttons**: Clear action options at bottom

**Account Details Card:**
- **Member Since**: Display account creation date
- **Read-only information** for reference
- **No Account ID**: Removed to maintain minimal design

**Design Principles Applied:**
- **Single edit button approach**: Simplified UX following card design patterns
- **View/edit state distinction**: Clear context for what's editable
- **Google OAuth integration**: Email handled appropriately as read-only
- **Minimal visual clutter**: Clean default state, form only when needed

#### **Addresses Tab**
**Comprehensive address management:**
- **Saved addresses list** with custom naming ("Home Address", "Work Office", "Parent's House")
- **Default badge system** - clear primary address indication
- **Individual address management** - add, edit, delete functionality
- **Canadian address format** - proper postal code validation
- **Full address requirements** - all fields including phone number
- **Add new address functionality** - prominent button for easy address creation
- **Set default address** - ability to change primary address
- **Address form design** - clean edit interface with proper field organization

**Address Management Interface:**
- **Card-based layout** with clean visual separation
- **Custom address naming** allowing personalized address labels
- **Default address badge** with black "Default" indicator
- **Action button hierarchy** - different button sets based on address status
- **Professional form design** with logical field grouping and Canadian compliance
- **Set as default checkbox** for easy primary address management

#### **Notifications Tab**
**Email preference management:**
- **Transactional emails** (required):
  - Order confirmations
  - Shipping notifications  
  - Delivery updates
- **Marketing emails** (optional):
  - Marketing emails (opt-in)
  - Newsletter subscription (opt-in)
  - Promotional offers (opt-in)
- **Email address display** with override options
- **Account-based preference control** for logged-in users

#### **Orders Tab**
**Visual order management with intuitive navigation:**

**Order List Display:**
- **Visual product representation**: Product images for better recognition and engagement
- **Image display strategy**: Maximum 3 product images per order with "+X more" text for additional items
- **Clean information hierarchy**: Order number, date, item count, status, and total amount
- **Status indicators**: Colored dots with status text (Processing, In Transit, Delivered, etc.)
- **Professional order numbering**: CLO-2025-001234 format for consistent identification

**Order Actions:**
- **Track button**: Direct navigation to dedicated tracking page (`/track/[orderNumber]`)
- **View Details button**: Navigation to detailed order view within account dashboard
- **Contextual actions**: Buttons available for all orders regardless of status
- **Clear user flow**: Orders → Tracking/Details → Comprehensive order information

**Visual Design Elements:**
- **Product image thumbnails**: Visual representation of ordered items for quick recognition
- **Overflow handling**: "+1 more", "+2 more" text when orders contain more than 3 items
- **Status color coding**: Visual status differentiation with colored indicators
- **Minimal card design**: Clean, professional appearance with proper spacing
- **Responsive layout**: Maintains visual hierarchy across different screen sizes

**Order Information Display:**
- **Order identification**: Prominent order number display (CLO-2025-001234)
- **Order metadata**: Date and item count in readable format ("July 8, 2025 • 4 items")
- **Financial information**: Clear total amount display with proper formatting
- **Status communication**: Colored dot indicators with descriptive status text
- **Item preview**: Visual thumbnails with overflow text for comprehensive item representation

**Navigation Integration:**
- **Tracking integration**: Seamless connection to public tracking pages
- **Detail view access**: In-dashboard detailed order information and management
- **Account ecosystem**: Integrated with overall account management workflow
- **Order history**: Complete order lifecycle representation and management

**Order Details View:**
- **Complete order breakdown**: Items, pricing, promotions, and summary
- **Bundle promotion display**: Visual tags showing "2 FOR $95" and percentage savings
- **Shipping information**: Complete address and delivery estimates
- **Payment method**: Secure display of payment information (last 4 digits)
- **Action buttons**: Track order and download invoice functionality
- **Navigation**: Clean back button to return to orders list

### **Authentication Strategy (Simplified)**

**Google OAuth Only Approach:**
- **NextAuth.js v4.24.11** with Google provider exclusively (v5 still in beta)
- **No email/password** complexity - focus on e-commerce features
- **No password management** - eliminates security complexity
- **Single OAuth flow** for all users (new and existing accounts)
- **Automatic account creation** for new users during OAuth process

**Authentication Flow Design:**
1. **"Guest Checkout"** → Email collection only for order completion
2. **"User Checkout"** → Redirect to `/login` → Google OAuth

**Email Communication Strategy:**
- **Guest Users**: Order updates sent to checkout email (transactional emails only)
- **Logged-In Users**: Order updates sent to account email (Google OAuth email)
- **Demo Application Note**: Email functionality simulated for portfolio demonstration
- **Simplified approach**: Focus on core order communication without complex preference management

## Order Status Management System

### **Complete Order Status Lifecycle**
**Comprehensive tracking from order placement to delivery:**

**Primary Status Flow:**
1. **Order Confirmation** - Initial order placement and payment processing
2. **Processing** - Order preparation and fulfillment updates (1-2 business days)
3. **Shipped** - Package dispatch with carrier information and tracking numbers
4. **In Transit** - Location-based tracking as package moves through delivery network
5. **Out for Delivery** - Package is with local carrier for final delivery
6. **Delivered** - Final delivery with timestamp and recipient confirmation

**Exception Handling:**
7. **Delayed/Exception** - For delivery delays, address issues, or carrier problems

**Status Indicators:**
- **Processing**: Black dot indicator
- **Shipped**: Blue dot indicator  
- **In Transit**: Orange dot indicator
- **Out for Delivery**: Yellow dot indicator
- **Delivered**: Green dot indicator
- **Delayed**: Red dot indicator

**Tracking Integration:**
- Tracking numbers and carrier information storage
- Direct integration with shipping provider APIs
- Real-time status updates and location tracking
- Estimated delivery windows with dynamic updates
- Public tracking page access via order number

## Checkout Page UI Specifications (`/checkout`)

### **Page Layout Structure**
**Multi-step checkout process designed for conversion optimization and user trust:**

#### **Navigation & Context**
- **Dynamic breadcrumbs:** "Home > Cart > Checkout"
- **Page title:** "CHECKOUT"
- **Consistent header:** Same navigation structure with secure checkout indicator
- **Progress stepper:** Visual indicator showing current step and remaining steps

#### **3-Step Checkout Process**
**Progressive disclosure approach to reduce abandonment:**

**Step 1: Contact Information**
- **Guest checkout:** Email collection for order communication only
- **User checkout:** Streamlined experience for authenticated users
- **Clear choice presentation:** Two distinct sections with obvious benefits for guest users

**Step 2: Shipping Information**
- **Address collection:** Full shipping address with Canadian postal code validation
- **Billing address:** "Same as shipping address" checkbox with optional different billing address
- **Shipping method selection:** Standard vs Express with pricing and delivery estimates
- **Tax calculation:** Real-time Canadian tax calculation based on shipping address

### **Payment Information Step (Step 3)**
- **Stripe integration:** Secure payment processing with multiple payment methods (Credit Card, PayPal)
- **No saved payment methods:** All users enter payment information fresh for enhanced security
- **Clean payment interface:** Minimal form focused on essential payment completion
- **Order review:** Final confirmation with complete pricing breakdown
- **Order placement:** Secure completion leading to order confirmation page

## **Order Confirmation Page (`/order/confirmation/[orderNumber]`)**

### **URL Structure & Accessibility**
**Order-specific URL pattern for professional e-commerce experience:**
- **URL format:** `/order/confirmation/[orderNumber]` (e.g., `/order/confirmation/CLO-2025-001234`)
- **Public access:** No authentication required - accessible via order number
- **Bookmarkable:** Users can save and return to their confirmation
- **Shareable:** Safe to include in emails and customer service interactions
- **Professional pattern:** Matches industry standards for order management

### **Page Design Philosophy**
**Minimal, clean interface following project design principles:**
- **Focused confirmation:** Clear "THANK YOU FOR YOUR ORDER!" messaging
- **Essential information only:** Order details, pricing, shipping - no unnecessary content
- **Professional layout:** Clean two-column design with proper visual hierarchy
- **Consistent branding:** Maintains black, white, gray color palette
- **No "what's next" clutter:** Users understand order flow without explicit guidance

### **Information Display Strategy**

#### **Order Header Section**
- **Success messaging:** "THANK YOU FOR YOUR ORDER!" with "Your order has been received"
- **Order number prominence:** Large, bold order number display (CLO-2025-001234)
- **Direct tracking access:** "TRACK ORDER" button leading to `/track/[orderNumber]` page

#### **Order Details Section**
- **Complete product information:** Items with promotion tags, variants, quantities, pricing
- **Bundle promotion display:** "2 FOR $95" and percentage savings tags as specified
- **Pricing transparency:** Full breakdown including subtotal, discounts, shipping, tax
- **Final total:** Clear "TOTAL $103.41" confirmation of amount charged

#### **Shipping Information Section**
- **Delivery address:** Complete Canadian address format with phone number
- **Billing address:** Same format as shipping address for payment confirmation
- **Shipping method:** Selected method with delivery timeframe (Standard Shipping 5-7 business days)
- **Estimated delivery:** Specific date range (July 17-19, 2025)

### **Public Page Security Considerations**
**Information display decisions for public accessibility:**
- **Address information:** Shipping and billing addresses displayed for user confirmation
- **No payment details:** No credit card information, payment methods, or sensitive financial data
- **Order content only:** Focus on what was ordered and where it's going
- **Secure by design:** Page content appropriate for public URL sharing

### **User Actions**
**Clear next steps for order completion:**
- **Continue Shopping:** Black button for immediate return to product browsing
- **View Order History:** White button for account-based order management (logged-in users)
- **Order tracking:** Direct access via "TRACK ORDER" button leading to `/track/[orderNumber]` page

### **Email Integration**
**Seamless communication flow:**
- **Automatic confirmation:** Order confirmation email sent immediately upon order completion
- **Email content:** Includes order details, confirmation page link, and direct tracking link to `/track/[orderNumber]`
- **Consistent experience:** Email confirmation mirrors confirmation page information
- **Direct tracking access:** Recipients can track orders immediately without additional steps

## **Order Tracking System**

### **Public Tracking Pages - Dual Page Architecture**

**Comprehensive tracking system with clean URL structure and professional user experience:**

#### **Tracking Landing Page (`/track`)**
**Simple search interface for manual order lookup:**
- **Clean search form**: Single input field for order number entry
- **Minimal design**: Focused interface matching project aesthetic
- **User guidance**: Clear instructions for order number format
- **Form submission**: Redirects to `/track/[orderNumber]` upon submission
- **Professional layout**: Consistent header navigation and footer

#### **Order Tracking Results Page (`/track/[orderNumber]`)**
**Dedicated order status interface with comprehensive tracking information:**

**URL Structure & Access Patterns:**
- **URL format**: `/track/[orderNumber]` (e.g., `/track/CLO-2025-001234`)
- **Direct access via email**: Tracking links in order confirmation and shipping emails
- **Account integration**: "Track Order" buttons from account dashboard
- **Manual search access**: Via `/track` page form submission
- **Cross-tracking capability**: Search input available for tracking additional orders

**Page Design & Information Architecture:**
- **Order identification**: Clear display of order number with search input
- **Professional tracking timeline**: Clean checkmark-based progress indicators
- **Complete status progression**: Order Confirmed → Package Shipped → In Transit → Out for Delivery → Delivered
- **Detailed timestamps**: Specific dates, times, and location information for each status
- **Minimal aesthetic**: Black and white design with colored status indicators

**Status-Specific Information:**
- **Order Confirmed**: Date, time, payment confirmation, processing location
- **Package Shipped**: Dispatch timestamp and origin facility
- **In Transit**: Current location and sorting facility updates
- **Out for Delivery**: Vehicle assignment and delivery route information
- **Delivered**: Final delivery timestamp, location, and confirmation details

**User Experience Features:**
- **Status color coding**: Visual indicators matching order lifecycle (black, blue, orange, yellow, green)
- **Real-time information**: Current package location and progress updates
- **Estimated delivery**: Dynamic delivery timeframes based on shipping progress
- **Professional messaging**: Clear, informative descriptions for each tracking event
- **Accessible design**: Clean typography and proper information hierarchy

### **Integration with Order Management**
**Seamless connection with overall order system:**

**Email Communication Integration:**
- **Order confirmation emails**: Include direct tracking links to `/track/[orderNumber]`
- **Shipping notification emails**: Direct access to current tracking status
- **Delivery update emails**: Links to final delivery confirmation
- **Guest user support**: No authentication required for tracking access

**Account Dashboard Integration:**
- **Track buttons**: Direct navigation from order history to tracking pages
- **Contextual access**: Skip search step for authenticated users
- **Order list integration**: Seamless tracking access from account interface
- **Cross-reference capability**: Easy tracking of multiple orders

**Security & Privacy:**
- **Order number requirement**: Security through knowledge-based access
- **Public page design**: Appropriate information display for non-authenticated access
- **No sensitive information**: Tracking pages exclude payment and detailed personal data
- **Professional information**: Focus on delivery status and logistics information

## Advanced Promotion System with Admin-Controlled Tags

### **Single Source of Truth for All Discounts**
- **NO product-level discounts** - all discounts managed through promotion system
- **Unified admin interface** - all pricing controls in Sanity Studio promotions
- **Required custom tags** - admin must define all tag labels and styling
- **Gender-specific organization** - promotions tagged for men's or women's deals pages
- **Better analytics** - track promotion performance by gender and specific campaigns

### **Admin-Controlled Product Tag System**

#### **Required Tag Configuration**
- **Tag Label:** Admin must define custom text for each promotion (no auto-generation)
- **Tag Colors:** Admin controls background and text colors for brand consistency
- **Tag Display:** Admin can enable/disable tag visibility on product cards
- **Gender Assignment:** Promotions assigned to men's or women's deals sections
- **Tag Validation:** Sanity Studio prevents empty labels and missing color fields

#### **Promotion Tag Display System**
**Visual implementation across all product displays:**
- **Position:** Top-left corner of product images
- **Size:** Small, unobtrusive rectangle overlay
- **Styling:** Admin-defined background and text colors for brand consistency
- **Responsive:** Scales appropriately on mobile devices
- **Visibility:** Only displays when product is assigned to active promotion

#### **Bundle Deal Tag Implementation**
**Special handling for bundle promotions:**
- **Primary tag:** Shows deal structure (e.g., "2 FOR $95")
- **Secondary tag:** Shows percentage savings (e.g., "21% OFF")
- **Multiple products:** Same tags applied to all items in bundle
- **Different variants:** Each color/size combination gets individual product card
- **Consistent messaging:** Same promotion tags across all bundle items

### **Supported Promotion Types**

#### **1. Percentage Discount Promotions**
- **"Selected Jeans 25% Off"** - Apply 25% discount to assigned jeans products
- **"Summer Clearance 30% Off"** - Apply 30% discount to shirts and pants collection
- **Cross-Category Support:** Single promotion spans multiple product categories
- **Gender Assignment:** Promotion appears in appropriate deals page (mens/womens)
- **Custom Tag Examples:** "DENIM DAYS", "SUMMER SALE", "BIG SAVINGS"

#### **2. Fixed Bundle Price Promotions**
- **"2 Blazers for $150"** - Fixed total price for specific quantities
- **"Any 3 Items for $120"** - Cross-category bundle pricing
- **Exact or Minimum Quantity:** Configurable quantity requirements
- **Cross-Variant Support:** Different colors/sizes count toward bundle
- **Custom Tag Examples:** "BLAZER BUNDLE", "TRIO DEAL", "MIX & MATCH"
- **Multi-Product Display:** Each variant shown separately in cart/checkout with same promotion tags

#### **3. Buy X Get Y Promotions**
- **"Buy 2 Get 1 Free"** - Classic BOGO promotions
- **"Buy 3 Get 2nd Half Off"** - Partial discounts on specific items
- **Flexible Free Item Rules:** Cheapest, most expensive, or customer choice
- **Partial Discount Option:** Percentage off instead of completely free
- **Custom Tag Examples:** "BOGO DEAL", "FREE ITEM", "BONUS SHIRT"

#### **4. Tiered Quantity Discounts**
- **"Buy More, Save More"** - Progressive discount tiers
- **Multiple Tier Support:** Unlimited quantity-based discount levels
- **Flexible Application:** Apply to all items, cheapest, or most expensive
- **Maximum Discount Caps:** Optional spending limits
- **Custom Tag Examples:** "BULK SAVINGS", "MORE = LESS", "VOLUME DEAL"

#### **5. Spend Threshold Promotions**
- **"Spend $200+, Get 15% Off"** - Cart value-based promotions
- **Multiple Discount Types:** Percentage, fixed amount, or free shipping
- **Category-Specific:** Apply to entire cart or specific categories
- **Maximum Discount Limits:** Optional discount capping
- **Custom Tag Examples:** "BIG SPENDER", "$200+ DEAL", "VIP SAVINGS"

## Complete Price Calculation System

### **Step-by-Step Calculation Logic**

#### **Step 1: Base Cart Subtotal**
```
For each item in cart:
- Start with product.basePrice
- Check if product is assigned to any active promotion
- Apply best applicable promotion discount (using promotion.priority)
- Item Final Price = basePrice - promotionDiscount

Cart Subtotal = Sum of all (Item Final Price × Quantity)
```

#### **Step 2: Promotion Discounts (Automatic)**
- **Applied automatically** when products are assigned to active promotions
- **Multiple promotion handling:** Use promotion.priority field for conflicts
- **Real-time calculation:** Updates as user adds/removes items
- **Simplified display format:** Combined into "Total Discount" line

#### **Step 3: Promo Code Discount (User-Applied)**
- **Single code limit** - only one promo code per order
- **Applied to subtotal AFTER promotion discounts**
- **Types supported:**
  - **Fixed amount:** "SAVE15" = -$15.00
  - **Percentage:** "SAVE10PERCENT" = -10% of current subtotal
  - **Free shipping:** "FREESHIP" = shipping cost becomes $0
- **Display format:** "Promo Code (SAVE15): -$15.00"

#### **Step 4: Shipping Calculation**
```
Shipping Logic:
1. Check discounted subtotal (after all discounts applied)
2. If subtotal ≥ $150 → Standard shipping = FREE
3. If promo code = "free shipping" → Shipping = $0
4. Else:
   - Standard shipping = $9.99
   - Express shipping = $19.99 (user choice)
```

#### **Step 5: Tax Calculation (Canadian Compliance)**
```
Tax Base = Subtotal - Promotion Discounts - Promo Code Discounts + Shipping

Tax calculation based on shipping address:
- Quebec (QC): GST (5%) + QST (9.975%) = 14.975%
- Ontario (ON): HST (13%)
- British Columbia (BC): GST (5%) + PST (7%) = 12%
- Alberta (AB): GST (5%) only
- [All other Canadian provinces per specifications]

Total Tax = Tax Base × Applicable Tax Rate
```

#### **Step 6: Final Total**
```
Grand Total = 
  Cart Subtotal
  - Promotion Discounts
  - Promo Code Discount  
  + Shipping Cost
  + Total Tax
```

### **Cart Display Format**
```
Line Items:
Oxford Shirt (2 FOR $95): $47.50 (was $60.00)
Chino Pants (2 FOR $95): $47.50 (was $60.00)

Order Summary:
Subtotal: $120.00
Promo Code (SAVE15): -$15.00
Total Discount: -$40.00
Shipping: TBD
Tax: TBD
────────────────────
Total: $80.00

💰 You saved $40.00 today!
```

## Order Communication & Post-Purchase Flow

### **Order Completion Sequence**
**Streamlined post-purchase experience:**
1. **Payment completion** → Stripe processing confirmation
2. **Order confirmation page** → Immediate success feedback at `/order/confirmation/[orderNumber]`
3. **Email confirmation** → Automatic order details and tracking link
4. **Order tracking access** → Public tracking page at `/track/[orderNumber]`
5. **Account integration** → Order appears in user dashboard (for logged-in users)

### **Guest User Order Updates**
1. **Order confirmation page access** - Immediate confirmation via public URL
2. **Email collected during checkout** - Contact step requires email address for order communication
3. **Transactional emails automatically sent** - Order confirmation, shipping, delivery updates
4. **Order tracking via public URLs** - `/track/[orderNumber]` with order number from email or confirmation page
5. **No account required** - Complete order management without registration

### **Logged-In User Order Updates**
1. **Account email used by default** - registered email from user account
2. **Preferences controlled in profile** - Account Dashboard → Notifications Tab
3. **Override options available** - can specify different email for orders in account settings
4. **Integrated order tracking** - full order history and tracking in account dashboard

### **Email Types and Management**
**Essential Transactional Emails (Demo Application):**
- Order confirmation
- Payment confirmation  
- Shipping notifications
- Delivery updates
- Order issues (delays, cancellations)

**Portfolio Demo Approach:**
- **Simplified email strategy** focused on core order communication
- **No complex preference management** appropriate for demo application
- **Simulated email functionality** for portfolio demonstration purposes
- **Focus on core e-commerce features** rather than email marketing complexity

## Key Project Decisions & Updates (Latest - July 16, 2025)

### **Complete Sanity Data Architecture (NEW)**
- ✅ **Unified Data Management**: All application data stored in Sanity for consistency
- ✅ **User Collection Structure**: Google OAuth integration with profile and preference management
- ✅ **Order Collection Design**: Comprehensive order tracking with guest and user support
- ✅ **Product-Promotion Integration**: Advanced promotion system with real-time pricing
- ✅ **Security Best Practices**: PCI-compliant payment data handling and user privacy protection
- ✅ **Admin Experience**: Complete order and user management through Sanity Studio
- ✅ **Guest User Support**: Full order management without account requirements
- ✅ **Address Management**: Multiple saved addresses with Canadian format compliance

### **Enhanced Order Management System (NEW)**
- ✅ **Complete Status Lifecycle**: Seven-status system from confirmation to delivery
- ✅ **Order Details View**: Comprehensive order breakdown with promotion display
- ✅ **Payment Security**: Last 4 digits display with Stripe integration
- ✅ **Shipping Integration**: Carrier tracking and delivery estimation
- ✅ **Admin Order Management**: Full order lifecycle control through Sanity Studio

### **Technology Stack Updates (LATEST)**
- ✅ **Next.js 15.4.1**: Latest version with Turbopack improvements and stability enhancements
- ✅ **TanStack Query 5.83.0**: Latest version with continued stable suspense support
- ✅ **Stripe API 2025-06-30.basil**: Updated to latest API version for newest features
- ✅ **Sanity Studio v4**: Major upgrade launched July 15, 2025 with Node.js 20+ requirement

### **Account Dashboard Redesign (FINALIZED)**
- ✅ **Streamlined 3-Tab Structure**: Profile (default), Orders, Addresses for focused functionality
- ✅ **Removed Notifications Tab**: Simplified approach appropriate for portfolio demo application
- ✅ **View/Edit State Pattern**: Clean information display with intentional editing modes
- ✅ **Single Edit Button Strategy**: Simplified UX following card design patterns instead of multiple field buttons
- ✅ **Google OAuth Email Handling**: Proper read-only treatment in edit mode with clear explanation
- ✅ **Account ID Removal**: Eliminated unnecessary complexity for portfolio project focus

### **Orders Tab Design Implementation (FINALIZED)**
- ✅ **Visual Product Representation**: Product images included for better user recognition and engagement
- ✅ **Smart Image Display Strategy**: Maximum 3 product images per order with "+X more" overflow text
- ✅ **Dual Action Approach**: "Track" button for tracking page navigation, "View Details" for detailed order view
- ✅ **Clear Information Hierarchy**: Order number, date, item count, status, and total without unnecessary labels
- ✅ **Professional Status System**: Colored dot indicators with descriptive status text
- ✅ **Intuitive Navigation Flow**: Clear user path from orders to tracking or detailed management
- ✅ **Production-Ready Design**: Professional appearance matching high-end e-commerce standards
- ✅ **Order Details View**: Comprehensive order breakdown with bundle promotions, shipping, and payment info
- ✅ **Status-Responsive Design**: Clean interface that adapts based on order status (Processing, Shipped, etc.)

### **Addresses Tab Design Implementation (FINALIZED)**
- ✅ **Card-Based Address Layout**: Clean visual separation with professional appearance
- ✅ **Custom Address Naming**: User-friendly labels like "Home Address", "Work Office"
- ✅ **Default Badge System**: Clear visual indication of primary address with black "Default" badge
- ✅ **Smart Action Buttons**: Context-aware button sets (Edit/Delete for default, Set Default/Edit/Delete for others)
- ✅ **Add Address Functionality**: Prominent black "ADD ADDRESS" button for easy access
- ✅ **Canadian Address Compliance**: Complete address format with postal code validation
- ✅ **Professional Form Design**: Clean edit interface with logical field grouping and proper spacing
- ✅ **Address Management Flow**: Seamless add, edit, delete, and set default functionality
- ✅ **Visual Product Representation**: Product images included for better user recognition and engagement
- ✅ **Smart Image Display Strategy**: Maximum 3 product images per order with "+X more" overflow text
- ✅ **Dual Action Approach**: "Track" button for tracking page navigation, "View Details" for detailed order view
- ✅ **Clear Information Hierarchy**: Order number, date, item count, status, and total without unnecessary labels
- ✅ **Professional Status System**: Colored dot indicators with descriptive status text
- ✅ **Intuitive Navigation Flow**: Clear user path from orders to tracking or detailed management
- ✅ **Production-Ready Design**: Professional appearance matching high-end e-commerce standards

### **Profile Management Enhancements (ESTABLISHED)**
- ✅ **Clean Default State**: Plain text information display without form styling
- ✅ **Smart Edit Mode**: Context-appropriate form fields with clear editable vs read-only distinction
- ✅ **Minimal Design Consistency**: Single edit approach maintains clean, uncluttered interface
- ✅ **Professional User Flow**: View information → click edit → modify → save/cancel → return to view

### **Enhanced Checkout Experience (ESTABLISHED)**
- ✅ **Required Phone Numbers**: All addresses require phone numbers for consistent data model and simplified UX
- ✅ **Address Naming System**: User custom names (Home Address, Work Address) with system badges (Default)
- ✅ **Streamlined Logged-In Interface**: Eliminates unnecessary email preferences and benefit messaging during checkout
- ✅ **Simplified Guest Flow**: Email collection for order communication only, no complex preference selection
- ✅ **No Saved Address Handling**: Direct form presentation without empty states or selection complexity
- ✅ **Billing Address Expansion**: Inline form revelation when "Same as shipping" unchecked
- ✅ **Conversion-Focused Design**: Minimal interface elements, clear progression paths, reduced decision fatigue

### **Technical Architecture Benefits**
- ✅ **Superior SEO Performance**: Dedicated pages for all major browsing patterns
- ✅ **Clean URL Hierarchy**: Professional structure matching major e-commerce sites
- ✅ **Marketing-Friendly URLs**: Campaign-ready URLs for specific deals and categories
- ✅ **Scalable Route System**: Easy to add new categories and genders without code duplication
- ✅ **Better Analytics**: Track performance of specific categories and deals with dedicated URLs
- ✅ **Enhanced User Experience**: Streamlined interfaces provide focused, engaging experiences
- ✅ **Professional Account Management**: Card-based, view/edit pattern matches enterprise-level applications

### **Business Intelligence Benefits**
- ✅ **Gender-Focused Marketing**: Separate deals strategies for men's and women's audiences
- ✅ **High-Impact Promotion Display**: Clear product-level promotion tags drive engagement
- ✅ **Campaign Attribution**: Track specific deal performance with dedicated URLs
- ✅ **Visual Marketing**: Product tags and styling create compelling promotional experiences
- ✅ **Conversion Optimization**: Focused shopping experiences without unnecessary complexity
- ✅ **Professional Presentation**: Streamlined interfaces match industry standards for premium brands
- ✅ **Improved Account Experience**: Clean, intuitive profile and address management reduces user frustration
- ✅ **Simplified Communication Strategy**: Streamlined email approach appropriate for portfolio demonstration
- ✅ **Enhanced Customer Experience**: Focused account management without unnecessary complexity
- ✅ **Security-First Payment Processing**: Stripe-only payment handling reduces PCI compliance complexity
- ✅ **Professional Order Management**: Visual order display with product images and intuitive navigation
- ✅ **Enhanced User Engagement**: Product images and clear status indicators improve order recognition
- ✅ **Streamlined Order Actions**: Clear separation between tracking and detailed order management
- ✅ **Production-Quality Interface**: Professional order list design matching enterprise e-commerce standards
- ✅ **Seamless Post-Purchase Journey**: Clear confirmation and tracking flow builds customer confidence and reduces support requests
- ✅ **Comprehensive Data Management**: Unified Sanity architecture provides complete control over all application data
- ✅ **Scalable User Management**: Flexible user system supporting both authentication patterns
- ✅ **Advanced Order Tracking**: Complete order lifecycle management with real-time status updates
- ✅ **Security-Compliant Architecture**: PCI-compliant payment handling and GDPR-compliant user data management

This comprehensive implementation showcases advanced full-stack development skills while solving real business problems with modern technology patterns, security best practices, and SEO-optimized design decisions that prioritize both user experience and search engine performance with a sophisticated promotion system that gives complete control to marketing teams, a streamlined checkout experience that maximizes conversion rates, a professional account management system with clean view/edit patterns and visual order management, a comprehensive post-purchase experience that builds customer trust and satisfaction, and a unified Sanity data architecture that provides complete control over all application content and transactional data.