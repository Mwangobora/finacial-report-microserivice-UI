import { apiRequest } from "@/services/api"
import type { Account, AccountBalances } from "./types"

// Get chart of accounts for a specific ledger
export async function getChartOfAccounts(entityUuid: string, ledgerName: string): Promise<Account[]> {
    try {
        return await apiRequest<Account[]>(`/entity/${entityUuid}/ledgers/${ledgerName}/chart-of-accounts/`)
    } catch (error) {
        console.error("Error in getChartOfAccounts:", error)
        throw error
    }
}

// Get all accounts globally
export async function getAllAccounts(): Promise<Account[]> {
    try {
        return await apiRequest<Account[]>("/all-accounts/")
    } catch (error) {
        console.error("Error in getAllAccounts:", error)
        throw error
    }
}

// Get accounts for a specific entity and ledger
export async function getEntityLedgerAccounts(entityUuid: string, ledgerName: string): Promise<Account[]> {
    try {
        return await apiRequest<Account[]>(`/entity/${entityUuid}/ledgers/${ledgerName}/accounts/`)
    } catch (error) {
        console.error("Error in getEntityLedgerAccounts:", error)
        throw error
    }
}

// Get balance for all accounts within a ledger (categorized by type)
export async function getAccountBalances(entityUuid: string, ledgerName: string): Promise<AccountBalances> {
    try {
        return await apiRequest<AccountBalances>(`/entity/${entityUuid}/ledgers/${ledgerName}/balance-for-accounts/`)
    } catch (error) {
        console.error("Error in getAccountBalances:", error)
        throw error
    }
}
