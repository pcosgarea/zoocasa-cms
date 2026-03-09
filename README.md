# Zoocasa CMS

A modern, full-featured content management system built with Next.js 15, designed to replace the existing WordPress blog at zoocasa.com/blog.

## Setup

For quick setup instructions, see `SETUP.md`.

## Features

### Public Blog Site
- Homepage with featured/popular/latest posts
- Individual blog post pages with SEO optimization
- Category filtering and pages
- Full-text search with keyword matching
- Configurable newsletter popup
- Responsive design matching Zoocasa brand
- Dynamic theming from admin settings
- Social sharing and author bio pages

### Admin Dashboard
- Role-based authentication (Admin, Editor, Author)
- Rich text post editor with Tiptap
- Category management with color coding
- User management and permissions
- Visual theme customization (colors, fonts, layouts, custom CSS)
- Newsletter popup editor with frequency controls
- Content calendar for planning (blog, social media, newsletter)
- Newsletter subscriber list with CSV export
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
- XML sitemap and RSS feed generation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS with CSS variables
- **Rich Text Editor**: Tiptap
- **File Storage**: Vercel Blob
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Vercel account for deployment

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your database:

Update `.env.local` with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/zoocasa_cms"
```

3. Run database migrations:
```bash
npm run db:push
```

4. Seed the database with initial data:
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@zoocasa.com` / `admin123` (⚠️ Change this password immediately!)
- Default categories (For Buyers, For Sellers, Real Estate News, etc.)
- Default theme settings matching Zoocasa brand
- Default newsletter popup settings

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zoocasa_cms"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Project Structure

```
zoocasa-cms/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public-facing blog
│   ├── (admin)/           # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── public/           # Public site components
│   ├── admin/            # Admin dashboard components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## WordPress Migration

To migrate content from your existing WordPress site:

1. Export your WordPress site (Tools > Export in WordPress admin)
2. Log into the admin dashboard (`/admin`)
3. Navigate to Migration tool
4. Upload the WordPress XML file
5. Preview the migration
6. Execute the migration

The tool will:
- Import all posts, categories, and authors
- Download and migrate images to Vercel Blob
- Convert WordPress HTML to Tiptap JSON format
- Preserve URL slugs for SEO
- Generate redirect rules

## Default Theme

The CMS comes pre-configured with Zoocasa's brand colors and fonts:

- Primary Color: #4695c4 (blue)
- Secondary Color: #b48e57 (tan/gold)
- Heading Font: Frank Ruhl Libre
- Body Font: Muli

All theme settings can be customized from the admin dashboard.

## Newsletter Integration

The newsletter popup collects email addresses and stores them in the database. You can:

1. Configure popup appearance, frequency, and behavior from admin dashboard
2. View all subscribers in the admin area
3. Export subscribers to CSV
4. Import the CSV into your preferred newsletter tool (Mailchimp, ConvertKit, Beehiiv, etc.)

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Set up PostgreSQL database (Vercel Postgres recommended)
5. Deploy

Vercel will automatically:
- Build your Next.js application
- Set up SSL certificate
- Configure custom domain
- Enable automatic deployments

## License

Private - Zoocasa Internal Use

## Support

For issues or questions, contact the development team.
