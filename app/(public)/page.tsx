import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: 3,
      include: {
        author: { select: { name: true } },
        categories: true,
      },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        author: { select: { name: true } },
        categories: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    }),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Welcome to the Zoocasa Blog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your source for real estate insights, market trends, and home buying tips
          </p>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:border-primary hover:bg-blue-50 transition"
                >
                  <div
                    className="h-2 w-2 rounded-full mr-2"
                    style={{ backgroundColor: category.color || "#4695c4" }}
                  ></div>
                  {category.name}
                  <span className="ml-2 text-gray-500">({category._count.posts})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-heading text-heading">
                Featured Posts
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden group"
                >
                  {post.featuredImage && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: cat.color ? `${cat.color}20` : "#4695c420",
                            color: cat.color || "#4695c4",
                          }}
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-heading mb-2 group-hover:text-primary transition">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-heading text-heading">
                Latest Posts
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden group"
                >
                  {post.featuredImage && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: cat.color ? `${cat.color}20` : "#4695c420",
                            color: cat.color || "#4695c4",
                          }}
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-heading mb-2 group-hover:text-primary transition">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {latestPosts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-heading mb-4">
              No posts published yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start creating content in the admin dashboard
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition"
            >
              Create Your First Post
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
