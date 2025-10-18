import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Calendar, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-tropical rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">Pattaya Directory</span>
                <p className="text-xs text-gray-400">Discover Amazing Events</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your ultimate guide to discovering the best concerts, festivals, nightlife, and cultural events in Pattaya, Thailand.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/events?type=concert" className="text-gray-400 hover:text-white transition-colors">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="/events?type=festival" className="text-gray-400 hover:text-white transition-colors">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/events?type=nightlife" className="text-gray-400 hover:text-white transition-colors">
                  Nightlife
                </Link>
              </li>
              <li>
                <Link href="/events?type=sports" className="text-gray-400 hover:text-white transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/events?type=market" className="text-gray-400 hover:text-white transition-colors">
                  Markets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>Pattaya City, Chonburi, Thailand 20150</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+66 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@pattayadirectory.com" className="hover:text-white transition-colors">
                  info@pattayadirectory.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Pattaya Directory. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}