"use client"

import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <motion.div className="flex items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div
        className="w-4 h-4 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-4 h-4 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-4 h-4 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </motion.div>
  )
}
