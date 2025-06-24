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
import { TransactionForm } from "./TransactionForm"
import { TransactionSummary } from "./TransactionSummary"

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
          <TransactionForm
            open={dialogOpen}
            setOpen={setDialogOpen}
            creating={creating}
            setCreating={setCreating}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            chartOfAccounts={chartOfAccounts}
            selectedEntity={selectedEntity}
            selectedLedger={selectedLedger}
            isFormValid={isFormValid as boolean}
          />
        </Dialog>
      </div>

      {/* Transaction Summary */}
      {selectedEntity && selectedLedger && (
        <TransactionSummary transactions={safeTransactions} />
      )}

      {/* Transactions List */}
      {selectedEntity && selectedLedger ? (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <TransactionsTable
            transactions={safeTransactions}
            onAdd={() => setDialogOpen(true)}
          />
        </div>
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
