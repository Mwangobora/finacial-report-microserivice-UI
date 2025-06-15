import { Card, CardContent } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

export function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
        <p className="text-muted-foreground">View and manage accounts for the selected ledger</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Account management coming soon</h3>
          <p className="text-muted-foreground text-center">This feature will be implemented in the next iteration</p>
        </CardContent>
      </Card>
    </div>
  )
}
