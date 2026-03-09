"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";

interface ThemeSettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  headingFont: string;
  bodyFont: string;
}

const GOOGLE_FONTS = [
  "Frank Ruhl Libre",
  "Muli",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Raleway",
  "Poppins",
  "Inter",
  "Crimson Text",
];

export default function ThemePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<ThemeSettings>({
    id: "singleton",
    primaryColor: "#4695c4",
    secondaryColor: "#b48e57",
    backgroundColor: "#ffffff",
    textColor: "#403d39",
    headingColor: "#252422",
    headingFont: "Frank Ruhl Libre",
    bodyFont: "Muli",
  });

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      const response = await fetch("/api/theme");
      if (response.ok) {
        const theme = await response.json();
        setFormData(theme);
      }
    } catch (error) {
      console.error("Error fetching theme:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Theme updated successfully! Refresh the page to see changes.");
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update theme");
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset theme to Zoocasa defaults?")) return;

    setFormData({
      id: "singleton",
      primaryColor: "#4695c4",
      secondaryColor: "#b48e57",
      backgroundColor: "#ffffff",
      textColor: "#403d39",
      headingColor: "#252422",
      headingFont: "Frank Ruhl Libre",
      bodyFont: "Muli",
    });
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading theme settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-heading">Theme Customization</h1>
          <p className="mt-2 text-gray-600">
            Customize colors and fonts for your blog
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Color Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-heading mb-4">Colors</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="#4695c4"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Used for buttons, links, and accents
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryColor: e.target.value })
                  }
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="#b48e57"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Used for highlights and decorative elements
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) =>
                    setFormData({ ...formData, backgroundColor: e.target.value })
                  }
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) =>
                    setFormData({ ...formData, backgroundColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Main background color for pages
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="#403d39"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Main body text color
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.headingColor}
                  onChange={(e) =>
                    setFormData({ ...formData, headingColor: e.target.value })
                  }
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.headingColor}
                  onChange={(e) =>
                    setFormData({ ...formData, headingColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="#252422"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Color for headings and titles
              </p>
            </div>
          </div>
        </div>

        {/* Typography Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-heading mb-4">Typography</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Font
              </label>
              <select
                value={formData.headingFont}
                onChange={(e) =>
                  setFormData({ ...formData, headingFont: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {GOOGLE_FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Font used for headings and titles
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Font
              </label>
              <select
                value={formData.bodyFont}
                onChange={(e) =>
                  setFormData({ ...formData, bodyFont: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {GOOGLE_FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Font used for body text
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-heading mb-4">Preview</h3>

          <div
            className="border-2 border-gray-200 rounded-lg p-8"
            style={{
              backgroundColor: formData.backgroundColor,
              color: formData.textColor,
            }}
          >
            <h1
              className="text-4xl font-bold mb-4"
              style={{
                color: formData.headingColor,
                fontFamily: `"${formData.headingFont}", serif`,
              }}
            >
              Sample Heading
            </h1>
            <p
              className="text-lg mb-4"
              style={{ fontFamily: `"${formData.bodyFont}", sans-serif` }}
            >
              This is a preview of your theme settings. Your body text will look
              like this paragraph.
            </p>
            <button
              type="button"
              className="px-6 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: formData.primaryColor }}
            >
              Primary Button
            </button>
            <span className="mx-3"></span>
            <button
              type="button"
              className="px-6 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: formData.secondaryColor }}
            >
              Secondary Button
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
