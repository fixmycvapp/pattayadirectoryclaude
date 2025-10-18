"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  author: {
    name: string;
  };
  publishedAt: string;
  priority: string;
  views: number;
  slug: string;
}

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events':
        return 'bg-blue-100 text-blue-800';
      case 'tourism':
        return 'bg-teal-100 text-teal-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      case 'transportation':
        return 'bg-purple-100 text-purple-800';
      case 'weather':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return (
        <Badge className="bg-red-600 text-white flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Urgent
        </Badge>
      );
    }
    if (priority === 'high') {
      return (
        <Badge className="bg-orange-600 text-white">
          Breaking
        </Badge>
      );
    }
    return null;
  };

  if (featured) {
    return (
      <Link href={`/news/${article.slug || article._id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="group"
        >
          <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="relative h-64 md:h-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category.replace('-', ' ')}
                  </Badge>
                  {getPriorityBadge(article.priority)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author.name}</span>
                  </div>
                </div>

                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Read Full Article
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug || article._id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full group">
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={getCategoryColor(article.category)}>
                {article.category.replace('-', ' ')}
              </Badge>
              {getPriorityBadge(article.priority)}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {article.summary}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(article.publishedAt), 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{article.views} views</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}