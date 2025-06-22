"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Plus } from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
  searchable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  title?: string
  description?: string
  searchPlaceholder?: string
  onAdd?: () => void
  addButtonText?: string
  emptyMessage?: string
  emptyDescription?: string
  EmptyIcon?: React.ComponentType<{ className?: string }>
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  title,
  description,
  searchPlaceholder = "Search...",
  onAdd,
  addButtonText = "Add New",
  emptyMessage = "No data found",
  emptyDescription = "Get started by adding your first item",
  EmptyIcon,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data

    return data.filter((item) =>
      columns.some((column) => {
        if (!column.searchable) return false
        const value = item[column.key as keyof T]
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, columns])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const getValue = (item: T, column: Column<T>): React.ReactNode => {
    let value: any
    if (typeof column.key === "string" && column.key.includes(".")) {
      // Handle nested properties
      value = column.key.split(".").reduce((obj, key) => obj?.[key], item)
    } else {
      value = item[column.key as keyof T]
    }

    // Convert value to a React-renderable type
    if (value === null || value === undefined) {
      return "-"
    }
    if (typeof value === "object" && !React.isValidElement(value)) {
      return JSON.stringify(value)
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }
    return String(value)
  }

  return (
    <Card>
      {(title || description || onAdd) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {onAdd && (
              <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                {addButtonText}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent>
        {/* Search */}
        {columns.some((col) => col.searchable) && (
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            {EmptyIcon && <EmptyIcon className="h-12 w-12 text-muted-foreground mb-4" />}
            <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
            <p className="text-muted-foreground mb-4">{emptyDescription}</p>
            {onAdd && (
              <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                {addButtonText}
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key.toString()}
                      className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                      onClick={() => column.sortable && handleSort(column.key.toString())}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow key={item.uuid || item.id || index}>
                    {columns.map((column) => (
                      <TableCell key={column.key.toString()}>
                        {column.render
                          ? column.render(getValue(item, column), item)
                          : getValue(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
