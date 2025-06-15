"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Mail, Phone, Globe, MapPin } from "lucide-react"
import type { Entity } from "../types"

interface EntityCardProps {
  entity: Entity
  onSelect: (entityUuid: string) => void
}

export function EntityCard({ entity, onSelect }: EntityCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>{entity.name}</span>
          </CardTitle>
          <div className="flex space-x-1">
            {entity.hidden && <Badge variant="secondary">Hidden</Badge>}
            {entity.accrual_method && <Badge variant="outline">Accrual</Badge>}
          </div>
        </div>
        <CardDescription>
          {entity.city && entity.state ? `${entity.city}, ${entity.state}` : "No location specified"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {entity.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{entity.email}</span>
            </div>
          )}
          {entity.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{entity.phone}</span>
            </div>
          )}
          {entity.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{entity.website}</span>
            </div>
          )}
          {entity.address_1 && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{entity.address_1}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button className="w-full" onClick={() => onSelect(entity.uuid)}>
            Select Entity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
