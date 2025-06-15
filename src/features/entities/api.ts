import { apiRequest } from "@/services/api"
import type { Entity, CreateEntityRequest, Ledger, CreateLedgerRequest } from "@/types"

export async function createEntity(data: CreateEntityRequest): Promise<Entity> {
  return apiRequest<Entity>("/create-entity/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getEntity(entityUuid: string): Promise<Entity> {
  return apiRequest<Entity>(`/entities/${entityUuid}/`)
}

export async function listEntities(): Promise<Entity[]> {
  return apiRequest<Entity[]>("/list-entities/")
}

export async function createLedger(entityUuid: string, data: CreateLedgerRequest): Promise<Ledger> {
  return apiRequest<Ledger>(`/entities/${entityUuid}/ledgers/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function listLedgers(entityUuid: string): Promise<Ledger[]> {
  return apiRequest<Ledger[]>(`/entities/${entityUuid}/ledgers/`)
}
