import { apiRequest } from "@/services/api"
import type { Ledger, CreateLedgerRequest } from "./types"

export async function getEntityLedgers(entityUuid: string): Promise<Ledger[]> {
  return apiRequest<Ledger[]>(`/entity/${entityUuid}/ledgers/`)
}

export async function createLedger(entityUuid: string, data: CreateLedgerRequest): Promise<Ledger> {
  return apiRequest<Ledger>(`/entity/${entityUuid}/create-ledger/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function createChartOfAccounts(entityUuid: string, ledgerName: string): Promise<any> {
  return apiRequest<any>(`/entity/${entityUuid}/create-chart-of-accounts/`, {
    method: "POST",
    body: JSON.stringify({ ledger_name: ledgerName }),
  })
}
