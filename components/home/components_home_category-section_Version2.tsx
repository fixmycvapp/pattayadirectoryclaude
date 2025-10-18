"use client";

import { motion } from "framer-motion";
import { Music, Sparkles, Trophy, ShoppingBag, Users, Heart } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    icon: Music,
    title: "Concerts",
    count: "150+ Events",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    href: "/events?type=concert",
  },
  {
    icon: Sparkles,
    title: "Festivals",
    count: "80+ Events",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    href: "/events?type=festival",
  },
  {
    icon: Heart,
    title: "Nightlife",
    count: "200+ Events",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    href: "/events?type=nightlife",
  },
  {
    icon: Trophy,
    title: "Sports",
    count: "50+ Events",
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
    href: "/events?type=sports",
  },
  {
    icon: ShoppingBag,
    title: "Markets",
    count: "30+ Events",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    href: "/events?type=market",
  },
  {
    icon: Users,
    title: "Cultural",
    count: "40+ Events",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50",
    href: "/events?type=cultural",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <div className="group cursor-pointer">
                    <div className={`${category.bgColor} rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                      <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.count}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}