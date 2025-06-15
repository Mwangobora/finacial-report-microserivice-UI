"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { useLedgers } from "@/features/ledgers/hooks"

export function LedgersPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const { ledgers, loading } = useLedgers(selectedEntity)

  useEffect(() => {
    const stored = localStorage.getItem("selectedEntity")
    if (stored) {
      setSelectedEntity(stored)
    }
  }, [])

  if (!selectedEntity) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entity selected</h3>
          <p className="text-muted-foreground text-center">Please select an entity first to manage its ledgers</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading ledgers...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ledger Management</h1>
        <p className="text-muted-foreground">Manage ledgers for the selected entity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ledgers.map((ledger) => (
          <Card key={ledger.uuid}>
            <CardContent className="p-6">
              <h3 className="font-semibold">{ledger.ledger_name}</h3>
              <p className="text-sm text-muted-foreground">UUID: {ledger.uuid.slice(0, 8)}...</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {ledgers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ledgers found</h3>
            <p className="text-muted-foreground text-center">Create your first ledger for this entity</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
