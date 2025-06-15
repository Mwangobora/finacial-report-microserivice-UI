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
