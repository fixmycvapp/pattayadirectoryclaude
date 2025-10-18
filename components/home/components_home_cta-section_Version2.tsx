"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                Start Exploring Today
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Discover Pattaya's Best Events?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of event-goers finding amazing experiences every day. Never miss out on the action!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Browse All Events
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 h-14 px-10 text-lg font-semibold"
              >
                List Your Event
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-100">Active Events</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-blue-100">Happy Visitors</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">100+</div>
                <div className="text-blue-100">Top Venues</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}