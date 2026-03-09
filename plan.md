# Zoocasa CMS Implementation Plan

## Project Overview
Build a full-featured CMS to replace the existing WordPress blog at zoocasa.com/blog with a modern Next.js application featuring a customizable theme system, content planning tools, and complete WordPress migration.

## Tech Stack
- **Frontend/Backend**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js) with credentials provider
- **Hosting**: Vercel
- **Styling**: Tailwind CSS with CSS variables for dynamic theming
- **Rich Text Editor**: Tiptap or Novel (for blog post editing)
- **File Storage**: Vercel Blob for images and media
- **Email Service**: Not required (newsletter integration handled externally)

## Database Schema (Prisma)

### Core Models
```prisma
// User & Authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // hashed
  name          String
  role          UserRole  @default(AUTHOR)
  avatar        String?
  bio           String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  posts         Post[]
  contentPlans  ContentPlan[]
}

enum UserRole {
  ADMIN
  EDITOR
  AUTHOR
}

// Blog Posts
model Post {
  id              String      @id @default(cuid())
  title           String
  slug            String      @unique
  excerpt         String?
  content         String      // JSON from Tiptap
  featuredImage   String?
  status          PostStatus  @default(DRAFT)
  publishedAt     DateTime?
  seoTitle        String?
  seoDescription  String?
  keywords        String[]
  viewCount       Int         @default(0)
  authorId        String
  author          User        @relation(fields: [authorId], references: [id])
  categories      Category[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED
}

// Categories
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  color       String?  // hex color for category badge
  order       Int      @default(0)
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Newsletter Subscribers (simple collection for external tool integration)
model NewsletterSubscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  subscribedAt DateTime @default(now())
}

// Newsletter Popup Settings
model PopupSettings {
  id                String   @id @default("singleton")
  enabled           Boolean  @default(true)
  title             String
  description       String
  ctaText           String
  frequency         PopupFrequency @default(ONCE_PER_SESSION)
  delaySeconds      Int      @default(5)
  showAfterScroll   Int?     // percentage of page scroll
  backgroundColor   String   @default("#ffffff")
  textColor         String   @default("#000000")
  buttonColor       String   @default("#4695c4")
  updatedAt         DateTime @updatedAt
}

enum PopupFrequency {
  EVERY_VISIT
  ONCE_PER_SESSION
  ONCE_PER_DAY
  ONCE_PER_WEEK
}

// Theme Customization
model ThemeSettings {
  id                String   @id @default("singleton")
  primaryColor      String   @default("#4695c4")
  secondaryColor    String   @default("#b48e57")
  backgroundColor   String   @default("#ffffff")
  textColor         String   @default("#403d39")
  headingColor      String   @default("#252422")
  headingFont       String   @default("Frank Ruhl Libre")
  bodyFont          String   @default("Muli")
  logoUrl           String?
  faviconUrl        String?
  headerLayout      String   @default("default")
  footerLayout      String   @default("default")
  customCSS         String?
  updatedAt         DateTime @updatedAt
}

// Content Planning
model ContentPlan {
  id              String        @id @default(cuid())
  title           String
  type            ContentType
  platform        Platform[]
  scheduledFor    DateTime
  status          PlanStatus    @default(IDEA)
  notes           String?
  assignedToId    String
  assignedTo      User          @relation(fields: [assignedToId], references: [id])
  relatedPostId   String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum ContentType {
  BLOG_POST
  SOCIAL_MEDIA
  NEWSLETTER
}

enum Platform {
  WEBSITE
  FACEBOOK
  TWITTER
  LINKEDIN
  INSTAGRAM
  NEWSLETTER
}

enum PlanStatus {
  IDEA
  IN_PROGRESS
  REVIEW
  SCHEDULED
  PUBLISHED
}
```

## Project Structure

```
zoocasa-cms/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public-facing blog
│   │   │   ├── page.tsx           # Homepage with featured/latest posts
│   │   │   ├── blog/
│   │   │   │   ├── [slug]/        # Individual post pages
│   │   │   │   └── category/[slug]/  # Category pages
│   │   │   ├── search/            # Search results page
│   │   │   └── layout.tsx         # Public layout with dynamic theme
│   │   ├── (admin)/               # Admin dashboard
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/     # Analytics overview
│   │   │   │   ├── posts/         # Post management (list, create, edit)
│   │   │   │   ├── categories/    # Category management
│   │   │   │   ├── users/         # User management
│   │   │   │   ├── planning/      # Content calendar
│   │   │   │   ├── subscribers/   # Newsletter subscriber list (view/export only)
│   │   │   │   ├── theme/         # Theme customization
│   │   │   │   ├── popup/         # Popup settings
│   │   │   │   └── migration/     # WordPress import tool
│   │   │   └── layout.tsx         # Admin layout
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   │   ├── posts/             # Post CRUD API
│   │   │   ├── categories/        # Category API
│   │   │   ├── newsletter/        # Newsletter subscription
│   │   │   ├── search/            # Search API (full-text)
│   │   │   ├── upload/            # Image upload to Vercel Blob
│   │   │   └── migration/         # WordPress XML import
│   │   └── layout.tsx
│   ├── components/
│   │   ├── public/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── CategoryBadge.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── NewsletterPopup.tsx
│   │   ├── admin/
│   │   │   ├── PostEditor.tsx     # Rich text editor
│   │   │   ├── ThemeEditor.tsx    # Visual theme customization
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── FontSelector.tsx
│   │   │   ├── ContentCalendar.tsx
│   │   │   └── MediaLibrary.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── theme.ts               # Theme utilities
│   │   ├── search.ts              # Search logic (PostgreSQL full-text)
│   │   └── wordpress-parser.ts    # WordPress XML parser
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── usePopup.ts
│   │   └── useSearch.ts
│   └── types/
│       └── index.ts
├── public/
│   └── uploads/                   # Fallback for local dev
├── scripts/
│   └── migrate-wordpress.ts       # CLI tool for migration
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Implementation Phases

### Phase 1: Project Setup & Database
**Files to create:**
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config
- `.env.local` - Environment variables
- `tailwind.config.ts` - Tailwind setup
- `prisma/schema.prisma` - Database schema
- `src/lib/prisma.ts` - Prisma client instance

**Tasks:**
1. Initialize Next.js 15 project with TypeScript
2. Install dependencies (Prisma, NextAuth, Tailwind, etc.)
3. Set up Prisma with PostgreSQL connection
4. Create database schema
5. Run initial migration
6. Create seed data (admin user, sample categories)

### Phase 2: Authentication System
**Files to create:**
- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API routes
- `src/app/(auth)/login/page.tsx` - Login page
- `src/middleware.ts` - Route protection

**Tasks:**
1. Configure NextAuth with credentials provider
2. Implement password hashing (bcrypt)
3. Create login page
4. Set up role-based access control middleware
5. Create protected admin layout

### Phase 3: Admin Dashboard - Core
**Files to create:**
- `src/app/(admin)/admin/layout.tsx` - Admin layout with sidebar
- `src/app/(admin)/admin/dashboard/page.tsx` - Dashboard home
- `src/components/admin/Sidebar.tsx` - Navigation
- `src/components/admin/Topbar.tsx` - User menu

**Tasks:**
1. Build admin layout with navigation
2. Create dashboard with key metrics
3. Implement user menu and logout

### Phase 4: Blog Post Management
**Files to create:**
- `src/app/(admin)/admin/posts/page.tsx` - Post list with filters
- `src/app/(admin)/admin/posts/new/page.tsx` - Create post
- `src/app/(admin)/admin/posts/[id]/page.tsx` - Edit post
- `src/components/admin/PostEditor.tsx` - Rich text editor (Tiptap)
- `src/components/admin/MediaLibrary.tsx` - Image picker
- `src/app/api/posts/route.ts` - Post CRUD API
- `src/app/api/upload/route.ts` - Image upload to Vercel Blob

**Tasks:**
1. Install and configure Tiptap rich text editor
2. Build post creation form (title, slug, content, excerpt, featured image)
3. Implement image upload to Vercel Blob
4. Create post list with pagination, filters, and search
5. Add post status management (draft, scheduled, published)
6. Implement SEO fields (meta title, description, keywords)

### Phase 5: Category Management
**Files to create:**
- `src/app/(admin)/admin/categories/page.tsx` - Category CRUD
- `src/app/api/categories/route.ts` - Category API
- `src/components/admin/CategoryForm.tsx`

**Tasks:**
1. Build category management interface
2. Add drag-and-drop reordering
3. Color picker for category badges
4. Bulk category assignment for posts

### Phase 6: Theme Customization System
**Files to create:**
- `src/app/(admin)/admin/theme/page.tsx` - Theme editor
- `src/components/admin/ThemeEditor.tsx` - Visual theme customization
- `src/components/admin/ColorPicker.tsx`
- `src/components/admin/FontSelector.tsx`
- `src/app/api/theme/route.ts` - Theme API
- `src/lib/theme.ts` - Theme utilities
- `src/hooks/useTheme.ts` - Client-side theme hook

**Tasks:**
1. Create theme editor with live preview
2. Color picker for all theme colors (primary, secondary, background, text, heading)
3. Font selector with Google Fonts integration
4. Logo/favicon uploader
5. Layout selector (header/footer variations)
6. Custom CSS editor with syntax highlighting
7. Generate CSS variables dynamically from database
8. Apply theme to public site in real-time

### Phase 7: Newsletter Popup System
**Files to create:**
- `src/app/(admin)/admin/popup/page.tsx` - Popup editor
- `src/components/public/NewsletterPopup.tsx` - Popup component
- `src/app/api/newsletter/route.ts` - Newsletter API
- `src/app/api/popup-settings/route.ts` - Popup settings API
- `src/hooks/usePopup.ts` - Popup behavior logic

**Tasks:**
1. Build configurable popup editor (title, description, CTA, colors)
2. Implement frequency settings (every visit, once per session, daily, weekly)
3. Add delay and scroll-trigger options
4. Create popup component with animations
5. Implement cookie/localStorage tracking for frequency control
6. Newsletter subscription form with email validation (stores in database only)

### Phase 8: Public Blog Site
**Files to create:**
- `src/app/(public)/layout.tsx` - Public layout with dynamic theme
- `src/app/(public)/page.tsx` - Homepage
- `src/app/(public)/blog/[slug]/page.tsx` - Post page
- `src/app/(public)/blog/category/[slug]/page.tsx` - Category page
- `src/components/public/Header.tsx`
- `src/components/public/Footer.tsx`
- `src/components/public/PostCard.tsx`
- `src/components/public/CategoryBadge.tsx`
- `src/components/public/FeaturedPost.tsx`

**Tasks:**
1. Build homepage with featured post, popular posts, latest posts
2. Create individual post page with SEO optimization
3. Add category pages with filtered posts
4. Implement pagination
5. Add social sharing buttons
6. Display author info and bio
7. Add related posts section
8. Generate dynamic sitemap and robots.txt

### Phase 9: Search Functionality
**Files to create:**
- `src/app/(public)/search/page.tsx` - Search results page
- `src/components/public/SearchBar.tsx` - Search input
- `src/app/api/search/route.ts` - Search API
- `src/lib/search.ts` - Full-text search logic

**Tasks:**
1. Implement PostgreSQL full-text search on posts
2. Search by title, excerpt, content, keywords, categories
3. Build search results page with highlighting
4. Add search suggestions/autocomplete
5. Create search bar component for header
6. Track search analytics

### Phase 10: Content Planning System
**Files to create:**
- `src/app/(admin)/admin/planning/page.tsx` - Content calendar
- `src/components/admin/ContentCalendar.tsx` - Calendar component
- `src/components/admin/ContentPlanForm.tsx` - Plan creation
- `src/app/api/content-plans/route.ts` - Content plan API

**Tasks:**
1. Build calendar view (monthly/weekly)
2. Create content plan form (type, platform, date, notes)
3. Add drag-and-drop rescheduling
4. Implement workflow states (idea, in progress, review, scheduled, published)
5. Link blog posts to content plans
6. Add filtering by type, platform, assignee
7. Email reminders for upcoming deadlines

### Phase 11: User Management
**Files to create:**
- `src/app/(admin)/admin/users/page.tsx` - User list
- `src/app/(admin)/admin/users/[id]/page.tsx` - User profile editor
- `src/app/api/users/route.ts` - User CRUD API

**Tasks:**
1. User list with role management
2. Create/edit user forms
3. Password reset functionality
4. User profile pages (public author pages)
5. Permission checking for different roles

### Phase 12: WordPress Migration Tool
**Files to create:**
- `src/app/(admin)/admin/migration/page.tsx` - Migration UI
- `src/app/api/migration/route.ts` - Migration API
- `src/lib/wordpress-parser.ts` - WordPress XML parser
- `scripts/migrate-wordpress.ts` - CLI migration tool

**Tasks:**
1. Build WordPress XML parser (WXR format)
2. Map WordPress posts to Prisma Post model
3. Map categories and authors
4. Download and migrate featured images to Vercel Blob
5. Convert WordPress HTML content to Tiptap JSON
6. Handle URL slug preservation for SEO
7. Create migration UI with progress tracking
8. Add dry-run mode to preview migration
9. Generate redirect rules for old URLs

### Phase 13: Subscriber Management
**Files to create:**
- `src/app/(admin)/admin/subscribers/page.tsx` - Subscriber list (view only)
- `src/app/api/subscribers/export/route.ts` - Export API

**Tasks:**
1. Display subscriber list with date subscribed
2. Export subscribers to CSV for use with external newsletter tools
3. Search and filter subscribers

### Phase 14: Analytics & SEO
**Files to create:**
- `src/app/(admin)/admin/analytics/page.tsx` - Analytics dashboard
- `src/lib/analytics.ts` - Analytics utilities

**Tasks:**
1. Track post views
2. Dashboard with charts (most viewed posts, traffic over time)
3. Generate SEO-friendly meta tags
4. Dynamic Open Graph images
5. Structured data (JSON-LD) for blog posts
6. XML sitemap generation
7. RSS feed

### Phase 15: Polish & Deployment
**Files to create:**
- `README.md` - Documentation
- `.env.example` - Environment variables template
- `vercel.json` - Vercel configuration

**Tasks:**
1. Add loading states and skeletons
2. Error boundaries and 404 pages
3. Toast notifications for user actions
4. Responsive design testing
5. Performance optimization (image optimization, lazy loading)
6. Set up PostgreSQL database on Vercel
7. Configure environment variables
8. Deploy to Vercel
9. Set up custom domain
10. SSL configuration

## Key Features Summary

### Public Site Features
- Homepage with featured/popular/latest posts
- Individual blog post pages with SEO
- Category filtering and pages
- Full-text search with keyword matching
- Newsletter popup (configurable frequency and styling)
- Responsive design matching Zoocasa brand
- Dynamic theming from admin settings
- Social sharing
- Author bio pages

### Admin Dashboard Features
- Role-based authentication (Admin, Editor, Author)
- Post editor with rich text (Tiptap)
- Category management with color coding
- User management and permissions
- Theme customization (colors, fonts, layouts, custom CSS)
- Newsletter popup editor with frequency controls
- Content calendar for planning (blog, social media, newsletter posts)
- Newsletter subscriber list with CSV export (for external tool integration)
- WordPress migration tool
- Analytics dashboard
- Media library

### Technical Features
- PostgreSQL full-text search
- Server-side rendering (SSR) for SEO
- Image optimization with Vercel Blob
- Real-time theme updates
- Scheduled post publishing
- SEO optimization (meta tags, Open Graph, structured data)
- Sitemap and RSS feed generation

## Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret"

# Vercel Blob (for images)
BLOB_READ_WRITE_TOKEN="..."

# Optional: Analytics
NEXT_PUBLIC_GA_ID="..."
```

## WordPress Migration Process
1. Export WordPress site as XML (WXR format) via Tools > Export
2. Upload XML file to admin migration tool
3. Tool parses posts, categories, authors, images
4. Preview migration (dry run)
5. Execute migration:
   - Create categories
   - Create author accounts (optional)
   - Import posts with content conversion
   - Download and upload images to Vercel Blob
   - Update image URLs in content
   - Preserve slugs for SEO
6. Generate redirect rules for old URLs
7. Verify imported content

## Design Matching Zoocasa Blog
The theme system will be pre-configured with Zoocasa's current design:
- **Primary Color**: #4695c4 (blue)
- **Secondary Color**: #b48e57 (tan/gold)
- **Heading Font**: Frank Ruhl Libre
- **Body Font**: Muli
- **Heading Color**: #252422 (dark)
- **Body Text**: #403d39 (charcoal)

Layout will mirror the current structure:
- Header with logo, navigation, and search
- Category navigation bar
- Featured post section on homepage
- Popular/Latest posts grid
- Sidebar with newsletter signup (now popup)
- Footer with content widgets

## Testing & Verification
1. **Authentication**: Test login with different roles, verify permissions
2. **Post Management**: Create, edit, publish, schedule posts
3. **Categories**: Create categories, assign to posts, view category pages
4. **Theme Editor**: Change colors/fonts, verify updates appear on public site
5. **Newsletter Popup**: Test different frequency settings, verify tracking
6. **Search**: Search for posts by keywords, verify results accuracy
7. **Content Calendar**: Create plans, schedule items, test workflow
8. **WordPress Migration**: Run test migration with sample XML export
9. **Newsletter Popup**: Subscribe via popup, verify email stored, export CSV
10. **Responsive Design**: Test on mobile, tablet, desktop
11. **SEO**: Verify meta tags, Open Graph, structured data, sitemap
12. **Performance**: Check Lighthouse scores, image optimization

## Next Steps After Approval
1. Set up Next.js project with all dependencies
2. Configure Prisma with PostgreSQL
3. Create database schema and run migrations
4. Build authentication system
5. Proceed through implementation phases systematically

## Estimated Component Count
- **Pages**: ~23 pages (public + admin)
- **Components**: ~45 reusable components
- **API Routes**: ~13 route handlers
- **Database Models**: 8 main models

## Key Simplifications from Original Requirements
- **Newsletter Management**: Removed campaign builder, email sending, and complex subscriber management. System only collects emails via popup and allows CSV export for integration with external newsletter tools (e.g., Mailchimp, ConvertKit, Beehiiv).
- **Content Planning**: Kept full content calendar for planning blog posts, social media, and newsletter content - but newsletter execution happens in external tool.

This is a comprehensive CMS that will give you full control over your blog's design, content, and planning workflows while maintaining the Zoocasa brand identity and allowing newsletter integration with your preferred external service.
