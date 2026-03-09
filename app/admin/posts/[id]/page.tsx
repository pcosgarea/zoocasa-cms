"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/posts/RichTextEditor";
import ImageUpload from "@/components/admin/posts/ImageUpload";

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string[];
  categories: Category[];
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<Post | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setAllCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const post = await response.json();
        setFormData(post);
      } else {
        alert("Post not found");
        router.push("/admin/posts");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Error loading post");
    } finally {
      setIsFetching(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    if (formData) {
      setFormData({
        ...formData,
        title,
        slug: generateSlug(title),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true);

    try {
      const categoryIds = formData.categories.map((cat) => cat.id);
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, categoryIds }),
      });

      if (response.ok) {
        alert("Post updated successfully!");
      } else {
        alert("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/posts");
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred");
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/admin/posts"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-heading">Edit Post</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.title}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Enter post title..."
            className="w-full px-4 py-2 text-2xl font-bold border-0 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Slug */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">/blog/</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="post-url-slug"
              className="flex-1 ml-1 px-2 py-1 border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-sm"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt || ""}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            rows={3}
            placeholder="Brief description of the post..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <ImageUpload
            value={formData.featuredImage}
            onChange={(url) => setFormData({ ...formData, featuredImage: url })}
          />
        </div>

        {/* Rich Text Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Content
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.categories.some((cat) => cat.id === category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        categories: [...formData.categories, category],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        categories: formData.categories.filter(
                          (cat) => cat.id !== category.id
                        ),
                      });
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color || "#4695c4" }}
                  ></div>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SEO Fields */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-heading mb-4">SEO Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, seoTitle: e.target.value })
                }
                placeholder="Leave blank to use post title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={60}
              />
              <p className="mt-1 text-xs text-gray-500">
                {(formData.seoTitle || "").length}/60 characters (optimal: 50-60)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seoDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                rows={3}
                placeholder="Leave blank to use excerpt"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={160}
              />
              <p className="mt-1 text-xs text-gray-500">
                {(formData.seoDescription || "").length}/160 characters (optimal: 120-160)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && keywordInput.trim()) {
                      e.preventDefault();
                      setFormData({
                        ...formData,
                        keywords: [...formData.keywords, keywordInput.trim()],
                      });
                      setKeywordInput("");
                    }
                  }}
                  placeholder="Type keyword and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          keywords: formData.keywords.filter((_, i) => i !== index),
                        })
                      }
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
        </div>
      </form>
    </div>
  );
}
