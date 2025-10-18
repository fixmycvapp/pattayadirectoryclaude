"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Calendar, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-tropical rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-tropical-orange rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-tropical-teal bg-clip-text text-transparent">
                Pattaya Directory
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Discover Amazing Events
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium rounded-lg hover:bg-blue-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="rounded-full bg-gradient-tropical">
              List Event
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 px-4 space-y-2">
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-tropical">
                  List Event
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}