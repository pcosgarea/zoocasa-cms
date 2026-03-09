import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, User, Search, ArrowLeft } from "lucide-react";

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  let posts: any[] = [];

  if (query) {
    posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { keywords: { hasSome: [query.toLowerCase()] } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        categories: true,
      },
    });
  }

  return (
    <div>
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold font-heading text-heading mb-6">
            Search the Blog
          </h1>

          {/* Search Form */}
          <form action="/search" method="get" className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search for posts..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <p className="mt-4 text-gray-600">
              Found {posts.length} result{posts.length !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query ? (
          posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
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
                      {post.categories.slice(0, 2).map((cat: any) => (
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
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-heading mb-4">
                No results found
              </h2>
              <p className="text-gray-600 mb-6">
                Try searching for a different term or browse our categories
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition"
              >
                Browse All Posts
              </Link>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-heading mb-4">
              Enter a search term
            </h2>
            <p className="text-gray-600">
              Search for posts by title, content, or keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
