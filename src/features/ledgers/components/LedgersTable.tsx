"use client"

import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import type { Ledger } from "@/types"

interface LedgersTableProps {
  ledgers: Ledger[]
  loading?: boolean
  onAdd?: () => void
  onSelect?: (ledgerName: string) => void
  onGenerateChart?: (ledgerName: string) => void
  generatingChart?: string | null
}

export function LedgersTable({ 
  ledgers, 
  loading, 
  onAdd, 
  onSelect, 
  onGenerateChart,
  generatingChart 
}: LedgersTableProps) {
  const columns: Column<Ledger>[] = [
    {
      key: "ledger_name",
      header: "Ledger Name",
      sortable: true,
      searchable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "posted",
      header: "Posted",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Posted" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "locked",
      header: "Locked",
      render: (value) =>
        value ? (
          <div className="flex items-center space-x-1">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span>Yes</span>
          </div>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    {
      key: "hidden",
      header: "Visibility",
      render: (value) => (
        <div className="flex items-center space-x-1">
          {value ? (
            <>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <span>Hidden</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>Visible</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, ledger) => (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect?.(ledger.ledger_name)}
            className="w-full sm:w-auto"
          >
            Select Ledger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateChart?.(ledger.ledger_name)}
            disabled={generatingChart === ledger.ledger_name}
            className="w-full sm:w-auto"
          >
            {generatingChart === ledger.ledger_name ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Chart"
            )}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={ledgers}
      columns={columns}
      loading={loading}
      title="Ledgers"
      description="Manage ledgers for the selected entity"
      searchPlaceholder="Search ledgers..."
      onAdd={onAdd}
      addButtonText="Create Ledger"
      emptyMessage="No ledgers found"
      emptyDescription="Create your first ledger to start recording transactions"
      EmptyIcon={BookOpen}
    />
  )
}
