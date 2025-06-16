import { apiRequest } from "@/services/api"
import type { Ledger, CreateLedgerRequest } from "./types"

export async function getEntityLedgers(entityUuid: string): Promise<Ledger[]> {
  try {
    return await apiRequest<Ledger[]>(`/entity/${entityUuid}/ledgers/`)
  } catch (error) {
    console.error("Error in getEntityLedgers:", error)
    throw error
  }
}

export async function createLedger(entityUuid: string, data: CreateLedgerRequest): Promise<Ledger> {
  try {
    return await apiRequest<Ledger>(`/entity/${entityUuid}/create-ledger/`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Error in createLedger:", error)
    throw error
  }
}

export async function createChartOfAccounts(entityUuid: string, ledgerName: string): Promise<any> {
  try {
    return await apiRequest<any>(`/entity/${entityUuid}/create-chart-of-accounts/`, {
      method: "POST",
      body: JSON.stringify({ ledger_name: ledgerName }),
    })
  } catch (error) {
    console.error("Error in createChartOfAccounts:", error)
    throw error
  }
}
