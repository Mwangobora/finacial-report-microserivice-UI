"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Building } from "lucide-react"
import { useEntities } from "@/features/entities/hooks"
import { EntityCard } from "@/features/entities/components/EntityCard"
import { CreateEntityForm } from "@/features/entities/components/CreateEntityForm"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/contexts/AppContext"
import type { CreateEntityRequest } from "@/features/entities/types"

export function EntitiesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const { entities, loading, addEntity } = useEntities()
  const { setSelectedEntity } = useAppContext()
  const { toast } = useToast()

  const handleCreateEntity = async (data: CreateEntityRequest) => {
    setCreating(true)
    try {
      await addEntity(data)
      setDialogOpen(false)
      toast({
        title: "Success",
        description: "Entity created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create entity",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleEntitySelect = (entityUuid: string) => {
    setSelectedEntity(entityUuid)
    toast({
      title: "Entity Selected",
      description: "You can now manage ledgers for this entity",
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading entities...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entity Management</h1>
          <p className="text-muted-foreground">Manage your business entities and organizations</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Entity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Entity</DialogTitle>
              <DialogDescription>Add a new business entity to the system</DialogDescription>
            </DialogHeader>
            <CreateEntityForm onSubmit={handleCreateEntity} loading={creating} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <EntityCard key={entity.uuid} entity={entity} onSelect={handleEntitySelect} />
        ))}
      </div>

      {entities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No entities found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first entity to get started with financial reporting
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Entity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
