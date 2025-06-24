"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CreateEntityRequest } from "@/types"

interface CreateEntityFormProps {
  onSubmit: (data: CreateEntityRequest) => Promise<void>
  loading: boolean
}

export function CreateEntityForm({ onSubmit, loading }: CreateEntityFormProps) {
  const [formData, setFormData] = useState<CreateEntityRequest>({
    name: "",
    address_1: "",
    address_2: "",
    path: "",
    depth: 0,
    admin: 1,
    city: "",
    state: "",
    zip_code: "",
    country: "",
    email: "",
    website: "",
    phone: "",
    hidden: false,
    accrual_method: true,
    fy_start_month: 1,
    last_closing_date: new Date().toISOString().split("T")[0],
    meta: {},
    managers: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Entity Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="path">Path *</Label>
          <Input
            id="path"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address_1">Address Line 1</Label>
          <Input
            id="address_1"
            value={formData.address_1}
            onChange={(e) => setFormData({ ...formData, address_1: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address_2">Address Line 2</Label>
          <Input
            id="address_2"
            value={formData.address_2}
            onChange={(e) => setFormData({ ...formData, address_2: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code">Zip Code</Label>
          <Input
            id="zip_code"
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fy_start_month">Fiscal Year Start Month</Label>
          <Select
            value={formData.fy_start_month.toString()}
            onValueChange={(value) => setFormData({ ...formData, fy_start_month: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_closing_date">Last Closing Date</Label>
          <Input
            id="last_closing_date"
            type="date"
            value={formData.last_closing_date}
            onChange={(e) => setFormData({ ...formData, last_closing_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="accrual_method"
            checked={formData.accrual_method}
            onCheckedChange={(checked) => setFormData({ ...formData, accrual_method: checked })}
          />
          <Label htmlFor="accrual_method" className="text-sm">Accrual Method</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="hidden"
            checked={formData.hidden}
            onCheckedChange={(checked) => setFormData({ ...formData, hidden: checked })}
          />
          <Label htmlFor="hidden" className="text-sm">Hidden</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Creating..." : "Create Entity"}
        </Button>
      </div>
    </form>
  )
}
