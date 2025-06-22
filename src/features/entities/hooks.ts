"use client"

import { useState, useEffect } from "react"
import { useApi } from "@/hooks/UseApi"
import { getEntity, createEntity, listEntities } from "./api"
import type { Entity, CreateEntityRequest } from "@/types"

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


