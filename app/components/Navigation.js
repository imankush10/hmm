"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "../../lib/utils";
import {
  Home,
  Package,
  FileText,
  BarChart3,
  FileBarChart,
  Settings,
  Menu,
  X,
  Leaf,
  Zap,
  Bot,
  LogOut,
  Shield,
  User,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and KPIs",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    description: "Material tracking",
  },
  {
    name: "BOM Management",
    href: "/bom",
    icon: FileText,
    description: "Bill of materials",
  },
  {
    name: "AI Optimization",
    href: "/optimize",
    icon: Bot,
    description: "Smart allocation",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileBarChart,
    description: "Environmental reports",
  },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  if (status === "loading") {
    return null; // Or a loading spinner
  }

  if (!session) {
    return null; // Don't show navigation when not authenticated
  }

  return (
    <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">Dhatu Chakra</h1>
                <p className="text-xs text-gray-400">
                  Lifecycle & Circularity Assessment
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-gray-700 text-blue-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu and Settings */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {session.user.name}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  {session.user.role === "admin" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {session.user.department}
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session.user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-gray-700 text-blue-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Mobile User Info */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {session.user.name}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      {session.user.role === "admin" ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {session.user.department}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
