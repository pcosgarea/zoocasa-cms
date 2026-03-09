"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User, Menu, X } from "lucide-react";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    avatar?: string | null;
  };
  onMenuClick: () => void;
}

export default function Topbar({ user, onMenuClick }: TopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-medium">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-700">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
        </button>

        {showUserMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="p-3 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
