"use client"

import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"
import { formatCurrency } from "@/utils/FormatMoney"
import type { Account } from "@/types"

interface AccountsTableProps {
  accounts: Account[]
  loading?: boolean
  title?: string
  description?: string
}

export function AccountsTable({ 
  accounts, 
  loading, 
  title = "Chart of Accounts",
  description = "Complete list of accounts in the ledger"
}: AccountsTableProps) {
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Asset":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Liability":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Equity":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Revenue":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Expense":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "COGS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const columns: Column<Account>[] = [
    {
      key: "account_code",
      header: "Code",
      sortable: true,
      searchable: true,
      render: (value) => (
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      ),
    },
    {
      key: "account_name",
      header: "Account Name",
      sortable: true,
      searchable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "account_type",
      header: "Type",
      sortable: true,
      render: (value) => (
        <Badge className={getAccountTypeColor(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: "current_balance",
      header: "Current Balance",
      sortable: true,
      render: (value) => (
        <span className="font-mono">
          {formatCurrency(parseFloat(value || "0"))}
        </span>
      ),
    },
    {
      key: "initial_balance",
      header: "Initial Balance",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-muted-foreground">
          {formatCurrency(parseFloat(value || "0"))}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      searchable: true,
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value || "Active"}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      data={accounts}
      columns={columns}
      loading={loading}
      title={title}
      description={description}
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found"
      emptyDescription="Accounts will appear here once they are created for this ledger"
      EmptyIcon={CreditCard}
    />
  )
}
