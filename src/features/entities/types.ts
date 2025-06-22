import { ReactNode } from "react"

export interface Entity {
  hidden: any
  accrual_method: any
  city: any
  state: any
  email: any
  phone: any
  address_1: ReactNode
  website: ReactNode
  uuid: string
  name: string
  type: string
  created_at: string
  updated_at: string
}

export interface CreateEntityRequest {
  name: string
  type: string
}

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
