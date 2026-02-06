import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default function MyRequestsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const user = useAuthStore((state) => state.user)

  // Wait for user to be loaded before filtering
  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground">
            Loading your requests...
          </p>
        </div>
      </div>
    )
  }

  const myRequests = mockData.requests.filter((r) => r.requesterEmail === user.email)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
        <p className="text-muted-foreground">
          Track the status of your access requests
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Request ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Requested</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {request.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{request.itemName}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">{request.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={request.priority === "urgent" ? "destructive" : "secondary"}>
                        {request.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(request.requestedAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "success"
                            : request.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
