import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, BarChart3, Building2, Search, Bell, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavigationSidebar } from "@/components/navigation-sidebar"

async function queryWithTimeout<T>(promise: Promise<T>, timeoutMs = 3000): Promise<T | null> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Query timeout")), timeoutMs)
    })

    return await Promise.race([promise, timeoutPromise])
  } catch (error) {
    console.error("Query failed or timed out:", error)
    return null
  }
}

export default async function Dashboard() {
  const supabase = createClient()

  let user = null
  let profile = null
  let employeeCount = 0
  let pendingLeaves = 0
  let displayName = "User"

  try {
    const authResult = await queryWithTimeout(supabase.auth.getUser(), 2000)
    user = authResult?.data?.user || null
  } catch (error) {
    console.error("Auth error:", error)
  }

  const [profileResult, employeeResult, leaveResult] = await Promise.allSettled([
    queryWithTimeout(
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id || "")
        .single(),
      2000,
    ),
    queryWithTimeout(supabase.from("employees").select("*", { count: "exact", head: true }), 2000),
    queryWithTimeout(
      supabase.from("leave_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      2000,
    ),
  ])

  if (profileResult.status === "fulfilled" && profileResult.value) {
    profile = profileResult.value.data
  }

  if (employeeResult.status === "fulfilled" && employeeResult.value) {
    employeeCount = employeeResult.value.count || 0
  }

  if (leaveResult.status === "fulfilled" && leaveResult.value) {
    pendingLeaves = leaveResult.value.count || 0
  }

  // Get current date
  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User"

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                {user ? (
                  <form action="/api/auth/signout" method="post">
                    <Button variant="outline" size="sm" type="submit">
                      Sign Out
                    </Button>
                  </form>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayName}</h1>
              <p className="text-gray-600">Today is {dateString}</p>
            </div>
            <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center">
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          {/* Setup Notice */}
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-orange-900">Setup Required</h3>
                  <p className="text-sm text-orange-700">
                    Run the database setup scripts to initialize your HR system.
                  </p>
                </div>
                <Link href="/setup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Setup Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Events & Tasks */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Events & Tasks</h2>
              <Link href="/calendar">
                <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                  View All Events
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Team Meeting</h3>
                      <p className="text-sm text-gray-600">10:00 AM - 11:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">New Hire Onboarding</h3>
                      <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Performance Review</h3>
                      <p className="text-sm text-gray-600">3:00 PM - 4:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reports & Insights */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports & Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/employees">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Employee Overview</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Total employees: {employeeCount}</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/attendance">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Attendance Summary</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Attendance trends and patterns.</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/leaves">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Pending Leave Requests</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Pending requests: {pendingLeaves}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
