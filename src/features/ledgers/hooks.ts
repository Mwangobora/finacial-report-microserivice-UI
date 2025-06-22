"use client"

import { useState, useEffect } from "react"
import { useApi } from "@/hooks/UseApi"
import { getEntityLedgers, createLedger, createChartOfAccounts } from "./api"
import type { Ledger, CreateLedgerRequest } from "@/types"

export function useLedgers(entityUuid: string | null) {
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  const { execute, loading, error } = useApi<Ledger[]>()

  const loadLedgers = async () => {
    if (!entityUuid) return

    try {
      const data = await execute(() => getEntityLedgers(entityUuid))
      if (data) setLedgers(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  const addLedger = async (ledgerData: CreateLedgerRequest) => {
    if (!entityUuid) throw new Error("No entity selected")

    const newLedger = await createLedger(entityUuid, ledgerData)
    setLedgers((prev) => [...prev, newLedger])
    return newLedger
  }

  const generateChartOfAccounts = async (ledgerName: string) => {
    if (!entityUuid) throw new Error("No entity selected")

    return createChartOfAccounts(entityUuid, ledgerName)
  }

  useEffect(() => {
    if (entityUuid) {
      loadLedgers()
    }
  }, [entityUuid])

  return {
    ledgers,
    loading,
    error,
    loadLedgers,
    addLedger,
    generateChartOfAccounts,
  }
}
