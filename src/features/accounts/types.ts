export interface Account {
  uuid: string
  account_name: string
  account_code: string
  account_type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense" | "COGS"
  ledger?: string
  entity_name?: string
  initial_balance: string
  current_balance: string
  description: string
  parent_account?: string
  status: string
  meta: Record<string, any>
}

export interface AccountBalance {
  uuid: string
  code: string
  name: string
  balance: string
}

export interface AccountBalances {
  assets: AccountBalance[]
  liabilities: AccountBalance[]
  equity: AccountBalance[]
  revenues: AccountBalance[]
  cogs: AccountBalance[]
  expenses: AccountBalance[]
}
