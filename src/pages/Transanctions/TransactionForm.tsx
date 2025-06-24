import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { CreateTransactionRequest } from "@/types"

interface TransactionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  creating: boolean;
  setCreating: (creating: boolean) => void;
  formData: CreateTransactionRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateTransactionRequest>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  chartOfAccounts: any[];
  selectedEntity: string | null;
  selectedLedger: string | null;
  isFormValid: boolean;
}

export function TransactionForm({
  open,
  setOpen,
  creating,
  setCreating,
  formData,
  setFormData,
  onSubmit,
  chartOfAccounts,
  selectedEntity,
  selectedLedger,
  isFormValid,
}: TransactionFormProps) {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Transaction</DialogTitle>
        <DialogDescription>Record a new financial transaction</DialogDescription>
      </DialogHeader>
      {/* ...existing selection and info blocks... */}
      <form onSubmit={onSubmit} className="space-y-4">
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
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
  )
}
