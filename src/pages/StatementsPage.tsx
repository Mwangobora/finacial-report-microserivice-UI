import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function StatementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Statements</h1>
        <p className="text-muted-foreground">View comprehensive financial reports</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Financial statements coming soon</h3>
          <p className="text-muted-foreground text-center">This feature will be implemented in the next iteration</p>
        </CardContent>
      </Card>
    </div>
  )
}
