"use client"

import { motion } from "framer-motion"
import { LogIn, UserPlus } from "lucide-react"

interface AuthToggleProps {
  isLogin: boolean
  onToggle: (isLogin: boolean) => void
}

export function AuthToggle({ isLogin, onToggle }: AuthToggleProps) {
  return (
    <div className="relative flex bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
      <motion.div
        className="absolute top-0 bottom-0 bg-white dark:bg-gray-700 shadow-sm rounded-t-lg"
        initial={false}
        animate={{
          left: isLogin ? 0 : "50%",
          width: "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => onToggle(true)}
        className={`relative z-10 flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
          isLogin ? "text-primary" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </button>

      <button
        onClick={() => onToggle(false)}
        className={`relative z-10 flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
          !isLogin ? "text-primary" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        <UserPlus className="w-4 h-4" />
        <span>Sign Up</span>
      </button>
    </div>
  )
}
