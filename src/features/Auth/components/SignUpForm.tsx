"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SmartInput } from "./SmartInput"
import { LoadingSpinner } from "./LoadingSpinner"
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface SignUpFormProps {
  onSwitchToLogin: () => void
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register } = useAuth()
  const { toast } = useToast()

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "first_name":
        if (!value) return "First name is required"
        if (value.length < 2) return "First name must be at least 2 characters"
        if (value.length > 50) return "First name cannot exceed 50 characters"
        return ""
      case "last_name":
        if (!value) return "Last name is required"
        if (value.length < 2) return "Last name must be at least 2 characters"
        if (value.length > 50) return "Last name cannot exceed 50 characters"
        return ""
      case "email":
        if (!value) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
        return ""
      case "password":
        if (!value) return "Password is required"
        if (value.length < 6) return "Password must be at least 6 characters"
        if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
        if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
        if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number"
        return ""
      case "confirmPassword":
        if (!value) return "Please confirm your password"
        if (value !== formData.password) return "Passwords do not match"
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

    // Also validate confirm password when password changes
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
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
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      setIsSuccess(true)

      toast({
        title: "Account created successfully!",
        description: "Welcome to Financial Reporting System.",
      })

      // Auto switch to login after success
      setTimeout(() => {
        onSwitchToLogin()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different information.",
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
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Account created successfully!</h3>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to sign in...</p>
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
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UserPlus className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Join us to start managing your finances</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SmartInput
            label="First Name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.first_name}
            icon={User}
            placeholder="John"
            autoComplete="given-name"
          />

          <SmartInput
            label="Last Name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.last_name}
            icon={User}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>

        <SmartInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={errors.email}
          icon={Mail}
          placeholder="john.doe@example.com"
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
          placeholder="Create a strong password"
          autoComplete="new-password"
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <SmartInput
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={errors.confirmPassword}
          icon={Lock}
          placeholder="Confirm your password"
          autoComplete="new-password"
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <Button type="submit" className="w-full relative overflow-hidden group" disabled={isSubmitting} size="lg">
          <motion.div className="flex items-center justify-center space-x-2" whileTap={{ scale: 0.98 }}>
            {isSubmitting ? (
              <LoadingSpinner />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </motion.div>
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
            Sign in here
          </button>
        </p>
      </div>
    </motion.div>
  )
}
