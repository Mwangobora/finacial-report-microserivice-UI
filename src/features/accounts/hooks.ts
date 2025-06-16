"use client"

import { useState, useEffect } from "react"
import { useApi } from "@/hooks/UseApi"
import { getChartOfAccounts, getAllAccounts, getEntityLedgerAccounts, getAccountBalances } from "./api"
import type { Account, AccountBalances } from "./types"
export function useAccounts(entityUuid: string | null, ledgerName: string | null) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const { execute, loading, error } = useApi<Account[]>()

  const loadAccounts = async () => {
    if (!entityUuid || !ledgerName) return

    try {
      const data = await execute(() => getEntityLedgerAccounts(entityUuid, ledgerName))
      if (data) setAccounts(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  useEffect(() => {
    if (entityUuid && ledgerName) {
      loadAccounts()
    }
  }, [entityUuid, ledgerName])

  return {
    accounts,
    loading,
    error,
    loadAccounts,
  }
}

export function useChartOfAccounts(entityUuid: string | null, ledgerName: string | null) {
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>([])
  const { execute, loading, error } = useApi<Account[]>()

  const loadChartOfAccounts = async () => {
    if (!entityUuid || !ledgerName) return

    try {
      const data = await execute(() => getChartOfAccounts(entityUuid, ledgerName))
      if (data) setChartOfAccounts(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  useEffect(() => {
    if (entityUuid && ledgerName) {
      loadChartOfAccounts()
    }
  }, [entityUuid, ledgerName])

  return {
    chartOfAccounts,
    loading,
    error,
    loadChartOfAccounts,
  }
}

export function useAccountBalances(entityUuid: string | null, ledgerName: string | null) {
  const [accountBalances, setAccountBalances] = useState<AccountBalances | null>(null)
  const { execute, loading, error } = useApi<AccountBalances>()

  const loadAccountBalances = async () => {
    if (!entityUuid || !ledgerName) return

    try {
      const data = await execute(() => getAccountBalances(entityUuid, ledgerName))
      if (data) setAccountBalances(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  useEffect(() => {
    if (entityUuid && ledgerName) {
      loadAccountBalances()
    }
  }, [entityUuid, ledgerName])

  return {
    accountBalances,
    loading,
    error,
    loadAccountBalances,
  }
}

export function useAllAccounts() {
  const [allAccounts, setAllAccounts] = useState<Account[]>([])
  const { execute, loading, error } = useApi<Account[]>()

  const loadAllAccounts = async () => {
    try {
      const data = await execute(() => getAllAccounts())
      if (data) setAllAccounts(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  useEffect(() => {
    loadAllAccounts()
  }, [])

  return {
    allAccounts,
    loading,
    error,
    loadAllAccounts,
  }
}
