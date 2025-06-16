import { apiRequest } from "@/services/api"
import type { Transaction, CreateTransactionRequest } from './types'

// Create a new transaction
export async function createTransaction(
    entityUuid: string,
    ledgerName: string,
    data: CreateTransactionRequest,
): Promise<Transaction> {
    try {
        return await apiRequest<Transaction>(`/entity/${entityUuid}/ledgers/${ledgerName}/create-transaction/`, {
            method: "POST",
            body: JSON.stringify(data),
        })
    } catch (error) {
        console.error("Error creating transaction:", error)
        throw error
    }
}

// Get all transactions for a specific ledger
export async function getTransactions(entityUuid: string, ledgerName: string): Promise<Transaction[]> {
    try {
        return await apiRequest<Transaction[]>(`/entity/${entityUuid}/ledgers/${ledgerName}/transactions/`)
    } catch (error) {
        console.error("Error fetching transactions:", error)
        throw error
    }
}
