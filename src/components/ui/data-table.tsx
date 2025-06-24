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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>}
              {description && <CardDescription className="text-sm">{description}</CardDescription>}
            </div>
            {onAdd && (
              <Button onClick={onAdd} className="w-full sm:w-auto">
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
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {EmptyIcon && <EmptyIcon className="h-12 w-12 text-muted-foreground mb-4" />}
            <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">{emptyDescription}</p>
            {onAdd && (
              <Button onClick={onAdd} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {addButtonText}
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {sortedData.map((item, index) => (
                <Card key={item.uuid || item.id || index} className="p-4">
                  <div className="space-y-3">
                    {columns.map((column) => {
                      const value = column.render
                        ? column.render(getValue(item, column), item)
                        : getValue(item, column);

                      // Skip empty values and actions column for mobile
                      if (!value || value === "-" || column.key === "actions") return null;

                      return (
                        <div key={column.key.toString()} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-muted-foreground min-w-0 flex-1">
                            {column.header}:
                          </span>
                          <div className="text-sm ml-2 text-right min-w-0 flex-1">
                            {value}
                          </div>
                        </div>
                      );
                    })}

                    {/* Actions for mobile - always show at bottom */}
                    {columns.find(col => col.key === "actions") && (
                      <div className="pt-3 border-t">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {columns.find(col => col.key === "actions")?.render?.(null, item)}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
