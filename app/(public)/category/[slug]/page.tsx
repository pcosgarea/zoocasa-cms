import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - Zoocasa Blog`,
    description: category.description || `Browse all posts in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          categories: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <div
              className="h-4 w-4 rounded-full mr-3"
              style={{ backgroundColor: category.color || "#4695c4" }}
            ></div>
            <h1 className="text-4xl font-bold font-heading text-heading">
              {category.name}
            </h1>
          </div>
          {category.description && (
            <p className="text-xl text-gray-600 max-w-3xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {category.posts.length} {category.posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {category.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.posts.map((post) => (
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
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-heading mb-4">
              No posts in this category yet
            </h2>
            <p className="text-gray-600 mb-6">
              Check back later for new content
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition"
            >
              Browse All Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
