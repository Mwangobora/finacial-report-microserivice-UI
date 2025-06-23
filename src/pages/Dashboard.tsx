import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, BookOpen, CreditCard, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useEntities } from "@/features/entities/hooks"
import { useLedgers } from "@/features/ledgers/hooks"
import { useAccounts } from "@/features/accounts/hooks"
import { useIncomeStatement } from "@/features/statements/hooks"
import { useAppContext } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/FormatMoney"
import { useNavigate } from "react-router-dom"

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: "spring" as const, stiffness: 60 }
  }),
}

export function Dashboard() {
  const navigate = useNavigate()
  const { selectedEntity, selectedLedger } = useAppContext()
  const { entities, loading: entitiesLoading } = useEntities()
  const { ledgers, loading: ledgersLoading } = useLedgers(selectedEntity)
  const { accounts, loading: accountsLoading } = useAccounts(selectedEntity, selectedLedger)
  const { incomeStatement, loadIncomeStatement } = useIncomeStatement()

  // Calculate stats
  const totalEntities = entities.length
  const activeLedgers = ledgers.filter(l => !l.hidden).length
  const totalAccounts = accounts.length
  const netIncome = incomeStatement?.net_income ? parseFloat(incomeStatement.net_income) : 0

  // Load income statement if we have entity and ledger selected
  React.useEffect(() => {
    if (selectedEntity && selectedLedger) {
      loadIncomeStatement(selectedEntity, selectedLedger).catch(() => {
        // Ignore errors for dashboard
      })
    }
  }, [selectedEntity, selectedLedger, loadIncomeStatement])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'entity':
        navigate('/entities')
        break
      case 'ledger':
        navigate('/ledgers')
        break
      case 'accounts':
        navigate('/accounts')
        break
      case 'transaction':
        navigate('/transactions')
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">Overview of your financial system</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Entities",
            icon: <Building className="h-5 w-5 text-blue-500" />,
            value: entitiesLoading === "loading" ? "..." : totalEntities.toString(),
            desc: entitiesLoading === "loading" ? "Loading..." : `${totalEntities} entities created`,
            bg: "bg-blue-50 dark:bg-blue-900/30",
          },
          {
            title: "Active Ledgers",
            icon: <BookOpen className="h-5 w-5 text-green-500" />,
            value: ledgersLoading === "loading" ? "..." : activeLedgers.toString(),
            desc: ledgersLoading === "loading" ? "Loading..." : selectedEntity ? `For selected entity` : "Select entity to view",
            bg: "bg-green-50 dark:bg-green-900/30",
          },
          {
            title: "Total Accounts",
            icon: <CreditCard className="h-5 w-5 text-purple-500" />,
            value: accountsLoading === "loading" ? "..." : totalAccounts.toString(),
            desc: accountsLoading === "loading" ? "Loading..." : selectedLedger ? `In selected ledger` : "Select ledger to view",
            bg: "bg-purple-50 dark:bg-purple-900/30",
          },
          {
            title: "Net Income",
            icon: <TrendingUp className="h-5 w-5 text-pink-500" />,
            value: netIncome ? formatCurrency(netIncome) : "-",
            desc: selectedEntity && selectedLedger ? "Current period" : "Select entity & ledger",
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
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleQuickAction('entity')}
              >
                + Create New Entity
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleQuickAction('ledger')}
              >
                + Set Up Ledger
              </Button>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleQuickAction('accounts')}
              >
                + Generate Chart of Accounts
              </Button>
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700"
                onClick={() => handleQuickAction('transaction')}
              >
                + Record Transaction
              </Button>
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
