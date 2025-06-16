import { apiRequest } from "@/services/api"
import type { Entity, CreateEntityRequest, Ledger, CreateLedgerRequest } from "@/types"

export async function createEntity(data: CreateEntityRequest): Promise<Entity> {
  try {
    return await apiRequest<Entity>("/create-entity/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Error in createEntity:", error)
    throw error
  }
}

export async function getEntity(entityUuid: string): Promise<Entity> {
  try {
    return await apiRequest<Entity>(`/entities/${entityUuid}/`)
  } catch (error) {
    console.error("Error in getEntity:", error)
    throw error
  }
}

export async function listEntities(): Promise<Entity[]> {
  try {
    return await apiRequest<Entity[]>("/list-entities/")
  } catch (error) {
    console.error("Error in listEntities:", error)
    throw error
  }
}

export async function createLedger(entityUuid: string, data: CreateLedgerRequest): Promise<Ledger> {
  try {
    return await apiRequest<Ledger>(`/entities/${entityUuid}/ledgers/`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Error in createLedger:", error)
    throw error
  }
}

export async function listLedgers(entityUuid: string): Promise<Ledger[]> {
  try {
    return await apiRequest<Ledger[]>(`/entities/${entityUuid}/ledgers/`)
  } catch (error) {
    console.error("Error in listLedgers:", error)
    throw error
  }
}
