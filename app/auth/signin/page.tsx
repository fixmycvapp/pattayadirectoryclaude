"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  const handleEmailSignIn = () => {
    signIn("credentials", { email, callbackUrl: "/profile" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Sign in to save events and get personalized recommendations
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full h-12 mb-4 font-semibold"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Sign In */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleEmailSignIn}
              className="w-full h-12 bg-gradient-tropical font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Email
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}