"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Calendar,
  Mail,
  Palette,
  Settings,
  Upload,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Planning", href: "/admin/planning", icon: Calendar },
  { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { name: "Theme", href: "/admin/theme", icon: Palette },
  { name: "Popup", href: "/admin/popup", icon: Settings },
  { name: "Migration", href: "/admin/migration", icon: Upload },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <Link href="/admin/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-primary">Zoocasa</span>
          <span className="ml-2 text-sm text-gray-500">CMS</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          v0.1.0
        </div>
      </div>
    </div>
  );
}
