"use client"

import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Mail, Phone, MapPin } from "lucide-react"
import type { Entity } from "@/types"

interface EntitiesTableProps {
  entities: Entity[]
  loading?: boolean
  onAdd?: () => void
  onSelect?: (entityUuid: string) => void
}

export function EntitiesTable({ entities, loading, onAdd, onSelect }: EntitiesTableProps) {
  const columns: Column<Entity>[] = [
    {
      key: "name",
      header: "Entity Name",
      sortable: true,
      searchable: true,
      render: (value, entity) => (
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      searchable: true,
      render: (value) =>
        value ? (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "phone",
      header: "Phone",
      searchable: true,
      render: (value) =>
        value ? (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "location",
      header: "Location",
      render: (_, entity) => {
        const location = [entity.city, entity.state].filter(Boolean).join(", ")
        return location ? (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      key: "accrual_method",
      header: "Method",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Accrual" : "Cash"}
        </Badge>
      ),
    },
    {
      key: "hidden",
      header: "Status",
      render: (value) => (
        <Badge variant={value ? "secondary" : "outline"}>
          {value ? "Hidden" : "Active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, entity) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect?.(entity.uuid)}
        >
          Select
        </Button>
      ),
    },
  ]

  return (
    <DataTable
      data={entities}
      columns={columns}
      loading={loading}
      title="Entities"
      description="Manage your business entities and organizations"
      searchPlaceholder="Search entities..."
      onAdd={onAdd}
      addButtonText="Create Entity"
      emptyMessage="No entities found"
      emptyDescription="Create your first entity to get started with financial reporting"
      EmptyIcon={Building}
    />
  )
}
