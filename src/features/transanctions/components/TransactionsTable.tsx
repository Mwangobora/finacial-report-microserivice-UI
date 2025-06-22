"use client"

import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react"
import { formatCurrency } from "@/utils/FormatMoney"
import type { Transaction } from "@/types"

interface TransactionsTableProps {
  transactions: Transaction[]
  loading?: boolean
  onAdd?: () => void
}

export function TransactionsTable({ transactions, loading, onAdd }: TransactionsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const columns: Column<Transaction>[] = [
    {
      key: "timestamp",
      header: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-mono">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      searchable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "tx_type",
      header: "Type",
      render: (value) => (
        <div className="flex items-center space-x-1">
          {value === "dr" ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-red-500" />
              <Badge variant="destructive">Debit</Badge>
            </>
          ) : (
            <>
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
              <Badge variant="default">Credit</Badge>
            </>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (value, transaction) => (
        <span 
          className={`font-mono font-medium ${
            transaction.tx_type === "dr" ? "text-red-600" : "text-green-600"
          }`}
        >
          {transaction.tx_type === "dr" ? "-" : "+"}
          {formatCurrency(parseFloat(value))}
        </span>
      ),
    },
    {
      key: "account_uuid",
      header: "Account",
      render: (value) => (
        <span className="text-sm text-muted-foreground font-mono">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: "corresponding_account_uuid",
      header: "Corresponding Account",
      render: (value) => (
        <span className="text-sm text-muted-foreground font-mono">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: "entity_unit_uuid",
      header: "Entity Unit",
      render: (value) => (
        <span className="text-sm text-muted-foreground font-mono">
          {value.substring(0, 8)}...
        </span>
      ),
    },
  ]

  return (
    <DataTable
      data={transactions}
      columns={columns}
      loading={loading}
      title="Transactions"
      description="All transactions for the selected ledger"
      searchPlaceholder="Search transactions..."
      onAdd={onAdd}
      addButtonText="Create Transaction"
      emptyMessage="No transactions found"
      emptyDescription="Create your first transaction to start recording financial activity"
      EmptyIcon={Receipt}
    />
  )
}
