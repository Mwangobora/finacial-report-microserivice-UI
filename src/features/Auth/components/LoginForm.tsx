"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SmartInput } from "./SmartInput"
import { LoadingSpinner } from "./LoadingSpinner"
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  onSwitchToSignUp: () => void
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { login } = useAuth()
  const { toast } = useToast()

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
        return ""
      case "password":
        if (!value) return "Password is required"
        if (value.length < 6) return "Password must be at least 6 characters"
        return ""
      default:
        return ""
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleInputBlur = (name: string, value: string) => {
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      setIsSuccess(true)

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      })

      // Redirect will be handled by AuthPage useEffect
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome back!</h3>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Lock className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SmartInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={errors.email}
          icon={Mail}
          placeholder="Enter your email"
          autoComplete="email"
        />

        <SmartInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={errors.password}
          icon={Lock}
          placeholder="Enter your password"
          autoComplete="current-password"
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <Button type="submit" className="w-full relative overflow-hidden group" disabled={isSubmitting} size="lg">
          <motion.div className="flex items-center justify-center space-x-2" whileTap={{ scale: 0.98 }}>
            {isSubmitting ? (
              <LoadingSpinner />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.div>
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToSignUp} className="text-primary hover:underline font-medium">
            Sign up here
          </button>
        </p>
      </div>
    </motion.div>
  )
}
