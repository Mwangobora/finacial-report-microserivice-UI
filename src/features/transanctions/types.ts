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
