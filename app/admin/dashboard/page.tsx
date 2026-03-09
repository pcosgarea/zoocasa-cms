import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  Users,
  FolderOpen,
  Mail,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  // Fetch statistics
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalUsers,
    totalCategories,
    totalSubscribers,
    recentPosts,
    topPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.user.count(),
    prisma.category.count(),
    prisma.newsletterSubscriber.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        categories: true,
      },
    }),
    prisma.post.findMany({
      take: 5,
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
      },
    }),
  ]);

  const stats = [
    {
      name: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "bg-blue-500",
      link: "/admin/posts",
    },
    {
      name: "Published",
      value: publishedPosts,
      icon: TrendingUp,
      color: "bg-green-500",
      link: "/admin/posts?status=PUBLISHED",
    },
    {
      name: "Drafts",
      value: draftPosts,
      icon: FileText,
      color: "bg-yellow-500",
      link: "/admin/posts?status=DRAFT",
    },
    {
      name: "Categories",
      value: totalCategories,
      icon: FolderOpen,
      color: "bg-purple-500",
      link: "/admin/categories",
    },
    {
      name: "Users",
      value: totalUsers,
      icon: Users,
      color: "bg-indigo-500",
      link: "/admin/users",
    },
    {
      name: "Subscribers",
      value: totalSubscribers,
      icon: Mail,
      color: "bg-pink-500",
      link: "/admin/subscribers",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.user?.name || "User"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.link}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-heading">Recent Posts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          by {post.author.name}
                        </span>
                        {post.categories.length > 0 && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex flex-wrap gap-1">
                              {post.categories.slice(0, 2).map((cat) => (
                                <span
                                  key={cat.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : post.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No posts yet. Create your first post to get started!
              </div>
            )}
          </div>
          {recentPosts.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Link
                href="/admin/posts"
                className="text-sm font-medium text-primary hover:text-blue-700"
              >
                View all posts →
              </Link>
            </div>
          )}
        </div>

        {/* Top Posts by Views */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-heading">
              Most Viewed Posts
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {topPosts.length > 0 ? (
              topPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-lg font-semibold text-gray-400">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.viewCount.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No published posts yet.
              </div>
            )}
          </div>
          {topPosts.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Link
                href="/admin/posts?status=PUBLISHED"
                className="text-sm font-medium text-primary hover:text-blue-700"
              >
                View all published posts →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-heading mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              New Post
            </span>
          </Link>
          <Link
            href="/admin/categories"
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              Manage Categories
            </span>
          </Link>
          <Link
            href="/admin/users/new"
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              Add User
            </span>
          </Link>
          <Link
            href="/admin/theme"
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-blue-50 transition-all text-center"
          >
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              Customize Theme
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
