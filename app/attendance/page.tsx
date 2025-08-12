import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceClockWidget } from "@/components/attendance-clock-widget"

export default async function AttendancePage() {
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

  // Get today's attendance
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employee?.id)
    .eq("date", today)
    .single()

  // Get recent attendance records
  const { data: recentAttendance } = await supabase
    .from("attendance")
    .select(`
      *,
      employees (
        first_name,
        last_name,
        employee_id
      )
    `)
    .eq("employee_id", employee?.id)
    .order("date", { ascending: false })
    .limit(10)

  // Get attendance stats for current month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { data: monthlyAttendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employee?.id)
    .gte("date", `${currentMonth}-01`)
    .lte("date", `${currentMonth}-31`)

  const presentDays = monthlyAttendance?.filter((att) => att.status === "present").length || 0
  const lateDays = monthlyAttendance?.filter((att) => att.status === "late").length || 0
  const absentDays = monthlyAttendance?.filter((att) => att.status === "absent").length || 0
  const totalWorkingDays = monthlyAttendance?.length || 0
  const attendanceRate = totalWorkingDays > 0 ? ((presentDays + lateDays) / totalWorkingDays) * 100 : 0

  // For managers/HR - get team attendance
  let teamAttendance = null
  const canViewTeamAttendance = profile?.role === "admin" || profile?.role === "hr" || profile?.role === "manager"

  if (canViewTeamAttendance) {
    const { data: teamData } = await supabase
      .from("attendance")
      .select(`
        *,
        employees (
          first_name,
          last_name,
          employee_id
        )
      `)
      .eq("date", today)
      .order("check_in_time", { ascending: false })

    teamAttendance = teamData
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance & Time Tracking</h1>
              <p className="text-gray-600">Track work hours and manage attendance</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clock In/Out Widget */}
        <div className="mb-8">
          <AttendanceClockWidget
            employeeId={employee?.id || ""}
            todayAttendance={todayAttendance}
            employeeName={`${employee?.first_name} ${employee?.last_name}`}
          />
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentDays}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Days</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lateDays}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absentDays}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Tabs */}
        <Tabs defaultValue="my-attendance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>
            {canViewTeamAttendance && <TabsTrigger value="team-attendance">Team Attendance</TabsTrigger>}
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="my-attendance">
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Break Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAttendance?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {record.check_in_time
                            ? new Date(record.check_in_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {record.check_out_time
                            ? new Date(record.check_out_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>{record.total_hours ? `${record.total_hours}h` : "-"}</TableCell>
                        <TableCell>{record.break_duration ? `${record.break_duration}m` : "0m"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "present"
                                ? "default"
                                : record.status === "late"
                                  ? "secondary"
                                  : record.status === "absent"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {!recentAttendance ||
                  (recentAttendance.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No attendance records found.</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          {canViewTeamAttendance && (
            <TabsContent value="team-attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Team Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours Worked</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamAttendance?.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {record.employees?.first_name} {record.employees?.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">{record.employees?.employee_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.check_in_time
                              ? new Date(record.check_in_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {record.check_out_time
                              ? new Date(record.check_out_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </TableCell>
                          <TableCell>{record.total_hours ? `${record.total_hours}h` : "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.status === "present"
                                  ? "default"
                                  : record.status === "late"
                                    ? "secondary"
                                    : record.status === "absent"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {!teamAttendance ||
                    (teamAttendance.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No attendance records for today.</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Calendar view coming soon...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will show a monthly calendar with attendance status for each day
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
