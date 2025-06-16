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
