"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationSidebar } from "@/components/navigation-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Users, Calendar, Clock, DollarSign, TrendingUp, Download } from "lucide-react"

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    totalAttendance: 0,
    avgAttendance: 0,
    totalPayroll: 0,
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30")
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUser(user)

        // Load profile
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
        }

        // Load statistics with error handling
        const [employeesResult, leavesResult, attendanceResult, payrollResult] = await Promise.allSettled([
          supabase.from("employees").select("*", { count: "exact", head: true }),
          supabase.from("leave_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("attendance").select("*", { count: "exact", head: true }),
          supabase.from("payroll").select("amount", { count: "exact" }),
        ])

        const newStats = { ...stats }

        if (employeesResult.status === "fulfilled") {
          newStats.totalEmployees = employeesResult.value.count || 0
          newStats.activeEmployees = employeesResult.value.count || 0
        }

        if (leavesResult.status === "fulfilled") {
          newStats.pendingLeaves = leavesResult.value.count || 0
        }

        if (attendanceResult.status === "fulfilled") {
          newStats.totalAttendance = attendanceResult.value.count || 0
          newStats.avgAttendance = 85 // Mock calculation
        }

        if (payrollResult.status === "fulfilled" && payrollResult.value.data) {
          newStats.totalPayroll = payrollResult.value.data.reduce(
            (sum: number, record: any) => sum + (record.amount || 0),
            0,
          )
        }

        setStats(newStats)
      } catch (error) {
        console.error("Error loading reports data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange])

  const canViewReports = profile?.role === "admin" || profile?.role === "hr"

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NavigationSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (!canViewReports) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NavigationSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>You don't have permission to view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Contact your administrator for access to reporting features.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600">Comprehensive insights into your HR operations</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Employees</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Leaves</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingLeaves}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">Awaiting approval</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Attendance</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.avgAttendance}%</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Payroll</p>
                      <p className="text-3xl font-bold text-gray-900">${stats.totalPayroll.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">This month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="leaves">Leaves</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Employee Distribution</CardTitle>
                      <CardDescription>Breakdown by department and employment type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Engineering</span>
                          <Badge variant="secondary">45%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Sales</span>
                          <Badge variant="secondary">25%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Marketing</span>
                          <Badge variant="secondary">20%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">HR</span>
                          <Badge variant="secondary">10%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest HR activities and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New employee onboarded</p>
                            <p className="text-xs text-gray-600">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Leave request approved</p>
                            <p className="text-xs text-gray-600">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Payroll processed</p>
                            <p className="text-xs text-gray-600">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Analytics</CardTitle>
                    <CardDescription>Track attendance patterns and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Attendance charts and analytics will be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">Data visualization coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaves" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Leave Analytics</CardTitle>
                    <CardDescription>Monitor leave patterns and balances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Leave analytics and trends will be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">Data visualization coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Analytics</CardTitle>
                    <CardDescription>Analyze payroll costs and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Payroll analytics and cost breakdowns will be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">Data visualization coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
