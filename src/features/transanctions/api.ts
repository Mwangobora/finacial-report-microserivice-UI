import { apiRequest } from "@/services/api"
import type { Transaction, CreateTransactionRequest } from "@/types"

// Create a new transaction
export async function createTransaction(
  entityUuid: string,
  ledgerName: string,
  data: CreateTransactionRequest,
): Promise<Transaction> {
  return apiRequest<Transaction>(
    `/entity/${entityUuid}/ledgers/${ledgerName}/create-transaction/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  )
}

// Get all transactions for a specific ledger
export async function getTransactions(entityUuid: string, ledgerName: string): Promise<Transaction[]> {
  const response = await apiRequest<{ transactions: Transaction[] }>(`/entity/${entityUuid}/ledgers/${ledgerName}/transactions/`)
  return response.transactions || []
}
