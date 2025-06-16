"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useLedgers } from "@/features/ledgers/hooks"
import { useAppContext } from "@/contexts/AppContext"
import { useToast } from "@/hooks/use-toast"
import type { CreateLedgerRequest } from "@/features/ledgers/types"

export function LedgersPage() {
  const { selectedEntity, setSelectedLedger } = useAppContext()
  const { ledgers, loading, addLedger, generateChartOfAccounts } = useLedgers(selectedEntity)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [creatingChart, setCreatingChart] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateLedgerRequest>({
    ledger_name: "",
    posted: false,
    locked: false,
    hidden: false,
    additional_info: {},
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEntity) return

    setCreating(true)
    try {
      await addLedger(formData)
      setDialogOpen(false)
      toast({
        title: "Success",
        description: "Ledger created successfully",
      })

      // Reset form
      setFormData({
        ledger_name: "",
        posted: false,
        locked: false,
        hidden: false,
        additional_info: {},
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ledger",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleCreateChartOfAccounts = async (ledgerName: string) => {
    if (!selectedEntity) return

    setCreatingChart(ledgerName)
    try {
      await generateChartOfAccounts(ledgerName)
      toast({
        title: "Success",
        description: "Chart of accounts created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chart of accounts",
        variant: "destructive",
      })
    } finally {
      setCreatingChart(null)
    }
  }

  const handleLedgerSelect = (ledgerName: string) => {
    setSelectedLedger(ledgerName)
    toast({
      title: "Ledger Selected",
      description: "You can now manage accounts and transactions for this ledger",
    })
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ledger Management</h1>
          <p className="text-muted-foreground">Manage ledgers for the selected entity</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Ledger
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ledger</DialogTitle>
              <DialogDescription>Add a new ledger to the selected entity</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ledger_name">Ledger Name *</Label>
                <Input
                  id="ledger_name"
                  value={formData.ledger_name}
                  onChange={(e) => setFormData({ ...formData, ledger_name: e.target.value })}
                  placeholder="e.g., MAIN_LEDGER_2024"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="posted"
                    checked={formData.posted}
                    onCheckedChange={(checked) => setFormData({ ...formData, posted: checked })}
                  />
                  <Label htmlFor="posted">Posted</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="locked"
                    checked={formData.locked}
                    onCheckedChange={(checked) => setFormData({ ...formData, locked: checked })}
                  />
                  <Label htmlFor="locked">Locked</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hidden"
                    checked={formData.hidden}
                    onCheckedChange={(checked) => setFormData({ ...formData, hidden: checked })}
                  />
                  <Label htmlFor="hidden">Hidden</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Ledger"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ledgers.map((ledger) => (
          <Card key={ledger.uuid} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="truncate">{ledger.ledger_name}</span>
                </CardTitle>
                <div className="flex space-x-1">
                  {ledger.posted && <Badge variant="default">Posted</Badge>}
                  {ledger.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  {ledger.hidden ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <CardDescription>UUID: {ledger.uuid.slice(0, 8)}...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <div className="flex space-x-1">
                    {ledger.posted && (
                      <Badge variant="secondary" className="text-xs">
                        Posted
                      </Badge>
                    )}
                    {ledger.locked && (
                      <Badge variant="destructive" className="text-xs">
                        Locked
                      </Badge>
                    )}
                    {!ledger.posted && !ledger.locked && (
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={() => handleLedgerSelect(ledger.ledger_name)}>
                    Select Ledger
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCreateChartOfAccounts(ledger.ledger_name)}
                    disabled={creatingChart === ledger.ledger_name}
                  >
                    {creatingChart === ledger.ledger_name ? (
                      "Creating Chart..."
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Chart of Accounts
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ledgers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ledgers found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first ledger for this entity to start tracking financial data
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Ledger
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
