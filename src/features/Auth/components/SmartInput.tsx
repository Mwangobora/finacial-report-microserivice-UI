"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, AlertCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartInputProps {
  label: string
  type: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  onBlur: (name: string, value: string) => void
  error?: string
  icon: LucideIcon
  placeholder?: string
  autoComplete?: string
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
}

export function SmartInput({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  placeholder,
  autoComplete,
  rightIcon: RightIcon,
  onRightIconClick,
}: SmartInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (hasInteracted && value && !error) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [value, error, hasInteracted])

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setHasInteracted(true)
    onBlur(name, value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value)
  }

  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          isFocused ? "text-primary" : "text-gray-700 dark:text-gray-300",
          error ? "text-red-500" : "",
        )}
      >
        {label}
      </Label>

      <div className="relative">
        <motion.div
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
            isFocused ? "text-primary" : "text-gray-400",
            error ? "text-red-500" : "",
            isValid ? "text-green-500" : "",
          )}
          animate={{
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>

        <Input
          id={name}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isFocused ? "ring-2 ring-primary/20 border-primary" : "",
            error ? "border-red-500 ring-2 ring-red-500/20" : "",
            isValid ? "border-green-500 ring-2 ring-green-500/20" : "",
          )}
        />

        <AnimatePresence>
          {(isValid || error || RightIcon) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {RightIcon && onRightIconClick ? (
                <button
                  type="button"
                  onClick={onRightIconClick}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <RightIcon className="w-4 h-4" />
                </button>
              ) : error ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : isValid ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="w-4 h-4 text-green-500" />
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus ring animation */}
        <motion.div
          className="absolute inset-0 rounded-md pointer-events-none"
          initial={false}
          animate={{
            boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "0 0 0 0px rgba(59, 130, 246, 0)",
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-500 flex items-center space-x-1"
          >
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
