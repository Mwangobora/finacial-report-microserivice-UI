"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useEntities } from "@/features/entities/hooks"
import { EntitiesTable } from "@/features/entities/components/EntitiesTable"
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

  if (loading === "loading") {
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

      <EntitiesTable
        entities={entities}
        loading={loading === "loading"}
        onAdd={() => setDialogOpen(true)}
        onSelect={handleEntitySelect}
      />
    </div>
  )
}
