"use client";

import Link from "next/link";
import { Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  status: string;
  author: { name: string };
  categories: { name: string; color: string | null }[];
  createdAt: Date;
  publishedAt: Date | null;
  viewCount: number;
}

export default function PostsTable({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">No posts found. Create your first post to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categories
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{post.title}</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    post.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : post.status === "DRAFT"
                      ? "bg-gray-100 text-gray-800"
                      : post.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{post.author.name}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {post.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat.name}
                      className="px-2 py-1 text-xs font-medium rounded"
                      style={{
                        backgroundColor: cat.color ? `${cat.color}20` : "#e5e7eb",
                        color: cat.color || "#374151",
                      }}
                    >
                      {cat.name}
                    </span>
                  ))}
                  {post.categories.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{post.categories.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {post.publishedAt
                  ? format(new Date(post.publishedAt), "MMM d, yyyy")
                  : format(new Date(post.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{post.viewCount}</td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-primary hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
