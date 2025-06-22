"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, Plus } from "lucide-react"
import { useTransactions } from "@/features/transanctions/hooks"
import { useChartOfAccounts } from "@/features/accounts/hooks"
import { useAppContext } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/FormatMoney"
import { formatDateTime } from "@/utils/FormatDate"
import { useToast } from "@/hooks/use-toast"
import type { CreateTransactionRequest } from "@/types"
import { TransactionsTable } from "@/features/transanctions/components/TransactionsTable"

export function TransactionsPage() {
  const { selectedEntity, selectedLedger } = useAppContext()
  const { transactions, loading, addTransaction } = useTransactions(selectedEntity, selectedLedger)
  const { chartOfAccounts } = useChartOfAccounts(selectedEntity, selectedLedger)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateTransactionRequest>({
    account_uuid: "",
    amount: 0,
    description: "",
    tx_type: "dr",
    entity_unit_uuid: "",
    corresponding_account_uuid: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEntity || !selectedLedger) return

    setCreating(true)
    try {
      await addTransaction(formData)
      setDialogOpen(false)
      toast({
        title: "Success",
        description: "Transaction created successfully",
      })

      // Reset form
      setFormData({
        account_uuid: "",
        amount: 0,
        description: "",
        tx_type: "dr",
        entity_unit_uuid: "",
        corresponding_account_uuid: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const getAccountName = (uuid: string) => {
    const account = chartOfAccounts.find((acc) => acc.uuid === uuid)
    return account ? `${account.account_code} - ${account.account_name}` : uuid.slice(0, 8) + "..."
  }

  if (!selectedEntity || !selectedLedger) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ArrowRightLeft className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entity or ledger selected</h3>
          <p className="text-muted-foreground text-center">
            Please select an entity and ledger first to manage transactions
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading === "loading") {
    return <div className="flex items-center justify-center h-64">Loading transactions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
          <p className="text-muted-foreground">Record and view financial transactions</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>Record a new financial transaction</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account_uuid">Account *</Label>
                <Select
                  value={formData.account_uuid}
                  onValueChange={(value) => setFormData({ ...formData, account_uuid: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartOfAccounts.map((account) => (
                      <SelectItem key={account.uuid} value={account.uuid}>
                        {account.account_code} - {account.account_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="corresponding_account_uuid">Corresponding Account *</Label>
                <Select
                  value={formData.corresponding_account_uuid}
                  onValueChange={(value) => setFormData({ ...formData, corresponding_account_uuid: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select corresponding account" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartOfAccounts.map((account) => (
                      <SelectItem key={account.uuid} value={account.uuid}>
                        {account.account_code} - {account.account_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tx_type">Transaction Type *</Label>
                  <Select
                    value={formData.tx_type}
                    onValueChange={(value: "dr" | "cr") => setFormData({ ...formData, tx_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr">Debit (DR)</SelectItem>
                      <SelectItem value="cr">Credit (CR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity_unit_uuid">Entity Unit UUID *</Label>
                <Input
                  id="entity_unit_uuid"
                  value={formData.entity_unit_uuid}
                  onChange={(e) => setFormData({ ...formData, entity_unit_uuid: e.target.value })}
                  placeholder="Enter entity unit UUID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Transaction description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Transaction"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                transactions.filter((t) => t.tx_type === "dr").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0),
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                transactions.filter((t) => t.tx_type === "cr").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <TransactionsTable
        transactions={transactions}
        loading={loading === "loading"}
        onAdd={() => setDialogOpen(true)}
      />
    </div>
  )
}
