"use client"

import { useState, useEffect } from "react"
import { useApi } from "@/hooks/UseApi"
import { getTransactions, createTransaction } from "./api"
import type { Transaction, CreateTransactionRequest } from "@/types"

export function useTransactions(entityUuid: string | null, ledgerName: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { execute, loading, error } = useApi<Transaction[]>()

  const loadTransactions = async () => {
    if (!entityUuid || !ledgerName) return

    try {
      const data = await execute(() => getTransactions(entityUuid, ledgerName))
      if (data) setTransactions(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  const addTransaction = async (transactionData: CreateTransactionRequest) => {
    if (!entityUuid || !ledgerName) throw new Error("No entity or ledger selected")

    const newTransaction = await createTransaction(entityUuid, ledgerName, transactionData)
    setTransactions((prev) => [...prev, newTransaction])
    return newTransaction
  }

  useEffect(() => {
    if (entityUuid && ledgerName) {
      loadTransactions()
    }
  }, [entityUuid, ledgerName])

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    addTransaction,
  }
}
