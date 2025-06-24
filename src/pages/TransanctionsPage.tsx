"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { ArrowRightLeft, Plus, AlertCircle, Building, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTransactions } from "@/features/transanctions/hooks"
import { useChartOfAccounts } from "@/features/accounts/hooks"
import { useAppContext } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/FormatMoney"
import { formatDateTime } from "@/utils/FormatDate"
import { useToast } from "@/hooks/use-toast"
import type { CreateTransactionRequest } from "@/types"
import { TransactionsTable } from "@/features/transanctions/components/TransactionsTable"

export function TransactionsPage() {
  const navigate = useNavigate()
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
    entity_unit_uuid: selectedEntity || "",
    corresponding_account_uuid: "",
  })

  
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      entity_unit_uuid: selectedEntity || ""
    }))
  }, [selectedEntity])

  
  const isFormValid = selectedEntity &&
                     selectedLedger &&
                     formData.account_uuid &&
                     formData.corresponding_account_uuid &&
                     formData.account_uuid !== formData.corresponding_account_uuid &&
                     formData.amount > 0



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEntity || !selectedLedger) {
      toast({
        title: "Error",
        description: "Please select both an entity and a ledger before creating a transaction",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!formData.account_uuid || !formData.corresponding_account_uuid) {
      toast({
        title: "Error",
        description: "Please select both an account and a corresponding account",
        variant: "destructive",
      })
      return
    }

    if (formData.account_uuid === formData.corresponding_account_uuid) {
      toast({
        title: "Error",
        description: "Account and corresponding account must be different",
        variant: "destructive",
      })
      return
    }

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
        entity_unit_uuid: selectedEntity || "",
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

  // Defensive: always use an array for transactions
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="space-y-6">
      {/* Selection Status */}
      {(!selectedEntity || !selectedLedger) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">Selection Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You need to select both an entity and a ledger before you can create transactions.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {!selectedEntity && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/entities')}
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Select Entity
                    </Button>
                  )}
                  {!selectedLedger && selectedEntity && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/ledgers')}
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Select Ledger
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Selection Display */}
      {selectedEntity && selectedLedger && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Entity: {selectedEntity}</span>
              </div>
              <div className="text-green-600">→</div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ledger: {selectedLedger}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transaction Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">Record and view financial transactions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedEntity || !selectedLedger}>
              <Plus className="mr-2 h-4 w-4" />
              Create Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>Record a new financial transaction</DialogDescription>
            </DialogHeader>

            {(!selectedEntity || !selectedLedger) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  Please select an entity and ledger before creating transactions.
                  {!selectedEntity && " No entity selected."}
                  {!selectedLedger && " No ledger selected."}
                </p>
              </div>
            )}

            {selectedEntity && selectedLedger && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  Creating transaction for: <strong>Entity {selectedEntity}</strong> → <strong>Ledger {selectedLedger}</strong>
                </p>
              </div>
            )}

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
                <p className="text-xs text-muted-foreground">
                  The primary account for this transaction
                </p>
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
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {chartOfAccounts
                      .filter(account => account.uuid !== formData.account_uuid)
                      .map((account) => (
                        <SelectItem key={account.uuid} value={account.uuid}>
                          {account.account_code} - {account.account_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The corresponding account for double-entry bookkeeping (must be different from the main account)
                </p>
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

              {/* Entity Unit UUID is automatically populated from selected entity */}
              <div className="space-y-2">
                <Label htmlFor="entity_unit_uuid">Entity Unit UUID</Label>
                <Input
                  id="entity_unit_uuid"
                  value={formData.entity_unit_uuid}
                  disabled
                  placeholder="Automatically populated from selected entity"
                  className="bg-muted"
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
                <Button
                  type="submit"
                  disabled={creating || !isFormValid}
                >
                  {creating ? "Creating..." : "Create Transaction"}
                </Button>
              </div>


            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction Summary */}
      {selectedEntity && selectedLedger && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Debits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  safeTransactions.filter((t) => t.tx_type === "dr").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0),
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
                  safeTransactions.filter((t) => t.tx_type === "cr").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions List */}
      {selectedEntity && selectedLedger ? (
        <TransactionsTable
          transactions={safeTransactions}
          onAdd={() => setDialogOpen(true)}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Entity or Ledger Selected</h3>
            <p className="text-muted-foreground text-center">
              Please select an entity and ledger to view and manage transactions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
