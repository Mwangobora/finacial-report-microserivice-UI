import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, BookOpen, CreditCard, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: "spring" as const, stiffness: 60 }
  }),
}

export function Dashboard() {
  return (
    <div className="space-y-6 px-2 md:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your financial reporting system</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Entities",
            icon: <Building className="h-5 w-5 text-blue-500" />,
            value: "-",
            desc: "Select entities to view data",
            bg: "bg-blue-50 dark:bg-blue-900/30",
          },
          {
            title: "Active Ledgers",
            icon: <BookOpen className="h-5 w-5 text-green-500" />,
            value: "-",
            desc: "Across all entities",
            bg: "bg-green-50 dark:bg-green-900/30",
          },
          {
            title: "Total Accounts",
            icon: <CreditCard className="h-5 w-5 text-purple-500" />,
            value: "-",
            desc: "In chart of accounts",
            bg: "bg-purple-50 dark:bg-purple-900/30",
          },
          {
            title: "Net Income",
            icon: <TrendingUp className="h-5 w-5 text-pink-500" />,
            value: "-",
            desc: "Current period",
            bg: "bg-pink-50 dark:bg-pink-900/30",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className={`shadow-md hover:shadow-xl transition-shadow duration-300 ${card.bg}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="shadow hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors duration-200">
                + Create New Entity
              </button>
              <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors duration-200">
                + Set Up Ledger
              </button>
              <button className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-colors duration-200">
                + Generate Chart of Accounts
              </button>
              <button className="w-full py-2 rounded-lg bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition-colors duration-200">
                + Record Transaction
              </button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="shadow hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Status:</span>
                <span className="text-green-600 font-semibold animate-pulse">Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Base URL:</span>
                <span className="text-xs text-muted-foreground">127.0.0.1:8008</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Version:</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
