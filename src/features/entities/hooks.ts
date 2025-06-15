"use client"

import { useState, useEffect } from "react"
import { useApi } from "@/hooks/UseApi"
import { getEntity, createEntity, listEntities, createLedger, listLedgers } from "./api"
import type { Entity, CreateEntityRequest, Ledger, CreateLedgerRequest } from "@/types"

export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>([])
  const { execute, loading, error } = useApi<Entity[]>()

  const loadEntities = async () => {
    try {
      const data = await execute(() => listEntities())
      if (data) setEntities(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  const addEntity = async (entityData: CreateEntityRequest) => {
    const newEntity = await createEntity(entityData)
    setEntities((prev) => [...prev, newEntity])
    return newEntity
  }

  useEffect(() => {
    loadEntities()
  }, [])

  return {
    entities,
    loading,
    error,
    loadEntities,
    addEntity,
  }
}

export function useLedgers(entityUuid: string | null) {
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  const { execute, loading, error } = useApi<Ledger[]>()

  const loadLedgers = async () => {
    if (!entityUuid) return

    try {
      const data = await execute(() => listLedgers(entityUuid))
      if (data) setLedgers(data)
    } catch (err) {
      // Error handled by useApi
    }
  }

  const addLedger = async (ledgerData: CreateLedgerRequest) => {
    if (!entityUuid) throw new Error("No entity selected")

    const newLedger = await createLedger(entityUuid, ledgerData)
    setLedgers((prev) => [...prev, newLedger])
    return newLedger
  }

  const generateChartOfAccounts = async (ledgerName: string) => {
    if (!entityUuid) throw new Error("No entity selected")
    return listLedgers(entityUuid)
  }

  useEffect(() => {
    if (entityUuid) {
      loadLedgers()
    }
  }, [entityUuid])

  return {
    ledgers,
    loading,
    error,
    loadLedgers,
    addLedger,
    generateChartOfAccounts,
  }
}
