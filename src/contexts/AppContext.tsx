"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AppContextType {
  selectedEntity: string | null
  selectedLedger: string | null
  setSelectedEntity: (entityUuid: string | null) => void
  setSelectedLedger: (ledgerName: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(() => {
    return localStorage.getItem("selectedEntity")
  })
  const [selectedLedger, setSelectedLedger] = useState<string | null>(() => {
    return localStorage.getItem("selectedLedger")
  })

  const handleSetSelectedEntity = (entityUuid: string | null) => {
    setSelectedEntity(entityUuid)
    if (entityUuid) {
      localStorage.setItem("selectedEntity", entityUuid)
    } else {
      localStorage.removeItem("selectedEntity")
    }
    // Clear ledger when entity changes
    setSelectedLedger(null)
    localStorage.removeItem("selectedLedger")
  }

  const handleSetSelectedLedger = (ledgerName: string | null) => {
    setSelectedLedger(ledgerName)
    if (ledgerName) {
      localStorage.setItem("selectedLedger", ledgerName)
    } else {
      localStorage.removeItem("selectedLedger")
    }
  }

  return (
    <AppContext.Provider
      value={{
        selectedEntity,
        selectedLedger,
        setSelectedEntity: handleSetSelectedEntity,
        setSelectedLedger: handleSetSelectedLedger,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
