"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, TrendingUp } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  // In app/news/page.tsx - Add revalidate
  export const revalidate = 21600; // Revalidate every 6 hours

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams({
        ...(category !== 'all' && { category }),
      });

      const response = await fetch(`${apiUrl}/news?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Local News
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest news and updates from Pattaya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-200 py-6 sticky top-0 z-10">
        <div className="container-custom">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="tourism">Tourism</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="transportation">Transport</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No news articles yet
              </h3>
              <p className="text-gray-600">Check back soon for updates</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="space-y-8">
              {/* Featured Article */}
              {featuredArticle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <NewsCard article={featuredArticle} featured />
                </motion.div>
              )}

              {/* Regular Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article, index) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NewsCard article={article} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}