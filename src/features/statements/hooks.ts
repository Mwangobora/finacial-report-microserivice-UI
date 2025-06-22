"use client"

import { useState } from "react"
import { useApi } from "@/hooks/UseApi"
import { getBalanceSheet, getIncomeStatement, getCashFlowStatement } from "./api"
import type { BalanceSheet, IncomeStatement, CashFlowStatement } from "@/types"

export function useBalanceSheet() {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null)
  const { execute, loading, error } = useApi<BalanceSheet>()

  const loadBalanceSheet = async (entityUuid: string, ledgerName: string) => {
    try {
      const data = await execute(() => getBalanceSheet(entityUuid, ledgerName))
      if (data) setBalanceSheet(data)
      return data
    } catch (err) {
      throw err
    }
  }

  return {
    balanceSheet,
    loading,
    error,
    loadBalanceSheet,
  }
}

export function useIncomeStatement() {
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null)
  const { execute, loading, error } = useApi<IncomeStatement>()

  const loadIncomeStatement = async (entityUuid: string, ledgerName: string) => {
    try {
      const data = await execute(() => getIncomeStatement(entityUuid, ledgerName))
      if (data) setIncomeStatement(data)
      return data
    } catch (err) {
      throw err
    }
  }

  return {
    incomeStatement,
    loading,
    error,
    loadIncomeStatement,
  }
}

export function useCashFlowStatement() {
  const [cashFlowStatement, setCashFlowStatement] = useState<CashFlowStatement | null>(null)
  const { execute, loading, error } = useApi<CashFlowStatement>()

  const loadCashFlowStatement = async (entityUuid: string, ledgerName: string) => {
    try {
      const data = await execute(() => getCashFlowStatement(entityUuid, ledgerName))
      if (data) setCashFlowStatement(data)
      return data
    } catch (err) {
      throw err
    }
  }

  return {
    cashFlowStatement,
    loading,
    error,
    loadCashFlowStatement,
  }
}
