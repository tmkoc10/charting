"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold text-white">Algoz Tech</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-zinc-400">
            {isLogin 
              ? "Sign in to access your trading dashboard" 
              : "Join us to start algorithmic trading"
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Button */}
        <div className="mt-8 text-center">
          <p className="text-zinc-400 mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleMode}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
