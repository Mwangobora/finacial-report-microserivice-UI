// Global shared types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export type LoadingState = "idle" | "loading" | "success" | "error"

export interface SelectOption {
  value: string
  label: string
}
// Entity Types
export interface Entity {
  uuid: string
  name: string
  address_1: string
  address_2: string
  path: string
  depth: number
  admin: number
  city: string
  state: string
  zip_code: string
  country: string
  email: string
  website: string
  phone: string
  hidden: boolean
  accrual_method: boolean
  fy_start_month: number
  last_closing_date: string
  meta: Record<string, any>
  managers: any[]
}

export interface CreateEntityRequest {
  name: string
  address_1: string
  address_2: string
  path: string
  depth: number
  admin: number
  city: string
  state: string
  zip_code: string
  country: string
  email: string
  website: string
  phone: string
  hidden: boolean
  accrual_method: boolean
  fy_start_month: number
  last_closing_date: string
  meta: Record<string, any>
  managers: any[]
}

// Ledger Types
export interface Ledger {
  uuid: string
  ledger_name: string
  entity: string
  posted: boolean
  locked: boolean
  hidden: boolean
  additional_info: Record<string, any>
}

export interface CreateLedgerRequest {
  ledger_name: string
  posted: boolean
  locked: boolean
  hidden: boolean
  additional_info: Record<string, any>
}

// Account Types
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

// Transaction Types
export interface Transaction {
  uuid: string
  account_uuid: string
  amount: string
  description: string
  tx_type: "dr" | "cr"
  entity_unit_uuid: string
  corresponding_account_uuid: string
  timestamp: string
}

export interface CreateTransactionRequest {
  account_uuid: string
  amount: number
  description: string
  tx_type: "dr" | "cr"
  entity_unit_uuid: string
  corresponding_account_uuid: string
}

// Financial Statement Types
export interface BalanceSheetItem {
  code: string
  name: string
  balance: string
  uuid: string
}

export interface BalanceSheet {
  assets: BalanceSheetItem[]
  total_assets: string
  liabilities: BalanceSheetItem[]
  total_liabilities: string
  equity: BalanceSheetItem[]
  total_equity: string
  total_liabilities_and_equity: string
}

export interface IncomeStatementItem {
  code: string
  name: string
  balance: string
  uuid: string
}

export interface IncomeStatement {
  revenues: IncomeStatementItem[]
  total_revenues: string
  cogs: IncomeStatementItem[]
  total_cogs: string
  gross_profit: string
  expenses: IncomeStatementItem[]
  total_expenses: string
  net_income: string
}

export interface CashFlowStatement {
  cash_from_operating_activities: string
  cash_from_investing_activities: string
  cash_from_financing_activities: string
  net_increase_in_cash: string
  beginning_cash_balance: string
  ending_cash_balance: string
  operating_activities_details: Array<{ item: string; amount: string }>
  investing_activities_details: Array<{ item: string; amount: string }>
  financing_activities_details: Array<{ item: string; amount: string }>
}

export interface AccountBalances {
  assets: BalanceSheetItem[]
  liabilities: BalanceSheetItem[]
  equity: BalanceSheetItem[]
  revenues: IncomeStatementItem[]
  cogs: IncomeStatementItem[]
  expenses: IncomeStatementItem[]
}

