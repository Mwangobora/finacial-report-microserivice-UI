import { apiRequest } from "@/services/api"
import type { BalanceSheet, IncomeStatement, CashFlowStatement } from "./types"

// Get balance sheet for a specific ledger
export async function getBalanceSheet(entityUuid: string, ledgerName: string): Promise<BalanceSheet> {
    try {
        return await apiRequest<BalanceSheet>(`/entity/${entityUuid}/ledgers/${ledgerName}/balance-sheet/`)
    } catch (error) {
        console.error("Error fetching balance sheet:", error)
        throw error
    }
}

// Get income statement for a specific ledger
export async function getIncomeStatement(entityUuid: string, ledgerName: string): Promise<IncomeStatement> {
    try {
        return await apiRequest<IncomeStatement>(`/entity/${entityUuid}/ledgers/${ledgerName}/income-statement/`)
    } catch (error) {
        console.error("Error fetching income statement:", error)
        throw error
    }
}

// Get cash flow statement for a specific ledger
export async function getCashFlowStatement(entityUuid: string, ledgerName: string): Promise<CashFlowStatement> {
    try {
        return await apiRequest<CashFlowStatement>(`/entity/${entityUuid}/ledgers/${ledgerName}/cash-flow-statement/`)
    } catch (error) {
        console.error("Error fetching cash flow statement:", error)
        throw error
    }
}
