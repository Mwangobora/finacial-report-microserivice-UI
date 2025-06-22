import { apiRequest } from "@/services/api"
import type { Transaction, CreateTransactionRequest } from "@/types"

// Create a new transaction
export async function createTransaction(
  entityUuid: string,
  ledgerName: string,
  data: CreateTransactionRequest,
): Promise<Transaction> {
  return apiRequest<Transaction>(
    `/report_microservice/api/entity/${entityUuid}/ledgers/${ledgerName}/create-transaction/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  )
}

// Get all transactions for a specific ledger
export async function getTransactions(entityUuid: string, ledgerName: string): Promise<Transaction[]> {
  return apiRequest<Transaction[]>(`/report_microservice/api/entity/${entityUuid}/ledgers/${ledgerName}/transactions/`)
}
