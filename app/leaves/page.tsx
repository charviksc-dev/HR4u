import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LeavesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and employee info
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: employee } = await supabase.from("employees").select("*").eq("profile_id", user.id).single()

  // Get leave requests based on user role
  let leaveRequestsQuery = supabase.from("leave_requests").select(`
    *,
    employees (
      first_name,
      last_name,
      employee_id
    ),
    leave_types (
      name,
      max_days_per_year
    ),
    profiles!leave_requests_approved_by_fkey (
      full_name
    )
  `)

  // If not admin/hr, only show own requests
  if (profile?.role !== "admin" && profile?.role !== "hr") {
    leaveRequestsQuery = leaveRequestsQuery.eq("employee_id", employee?.id)
  }

  const { data: leaveRequests } = await leaveRequestsQuery.order("created_at", { ascending: false })

  // Get leave types
  const { data: leaveTypes } = await supabase.from("leave_types").select("*").order("name")

  // Calculate leave stats
  const currentYear = new Date().getFullYear()
  const userLeaveRequests = leaveRequests?.filter((req) => req.employee_id === employee?.id) || []
  const approvedLeaves = userLeaveRequests.filter((req) => req.status === "approved")
  const pendingLeaves = userLeaveRequests.filter((req) => req.status === "pending")
  const totalDaysUsed = approvedLeaves.reduce((sum, req) => sum + req.days_requested, 0)

  const canManageLeaves = profile?.role === "admin" || profile?.role === "hr"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-gray-600">Manage leave requests and track time off</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link href="/leaves/request">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Leave
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Used</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysUsed}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {21 -
                  (approvedLeaves
                    .filter((req) => req.leave_types?.name === "Annual Leave")
                    .reduce((sum, req) => sum + req.days_requested, 0) || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {10 -
                  (approvedLeaves
                    .filter((req) => req.leave_types?.name === "Sick Leave")
                    .reduce((sum, req) => sum + req.days_requested, 0) || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Tabs */}
        <Tabs defaultValue="my-requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            {canManageLeaves && <TabsTrigger value="all-requests">All Requests</TabsTrigger>}
            {canManageLeaves && <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>}
          </TabsList>

          <TabsContent value="my-requests">
            <Card>
              <CardHeader>
                <CardTitle>My Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userLeaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.leave_types?.name}</TableCell>
                        <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{request.days_requested}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.profiles?.full_name || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {userLeaveRequests.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No leave requests found.</p>
                    <Link href="/leaves/request">
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Request Your First Leave
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {canManageLeaves && (
            <TabsContent value="all-requests">
              <Card>
                <CardHeader>
                  <CardTitle>All Leave Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests?.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {request.employees?.first_name} {request.employees?.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">{request.employees?.employee_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>{request.leave_types?.name}</TableCell>
                          <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                          <TableCell>{request.days_requested}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "approved"
                                  ? "default"
                                  : request.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="default">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {canManageLeaves && (
            <TabsContent value="pending-approval">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests
                        ?.filter((req) => req.status === "pending")
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {request.employees?.first_name} {request.employees?.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">{request.employees?.employee_id}</div>
                              </div>
                            </TableCell>
                            <TableCell>{request.leave_types?.name}</TableCell>
                            <TableCell>
                              {new Date(request.start_date).toLocaleDateString()} -{" "}
                              {new Date(request.end_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{request.days_requested}</TableCell>
                            <TableCell className="max-w-xs truncate">{request.reason || "-"}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="default">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {leaveRequests?.filter((req) => req.status === "pending").length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No pending leave requests.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
