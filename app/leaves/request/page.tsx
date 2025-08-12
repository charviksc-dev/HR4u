import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LeaveRequestForm } from "@/components/leave-request-form"

export default async function LeaveRequestPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get employee info
  const { data: employee } = await supabase.from("employees").select("*").eq("profile_id", user.id).single()

  if (!employee) {
    redirect("/employees/new")
  }

  // Get leave types
  const { data: leaveTypes } = await supabase.from("leave_types").select("*").order("name")

  // Get current year leave usage
  const currentYear = new Date().getFullYear()
  const { data: leaveUsage } = await supabase
    .from("leave_requests")
    .select("*, leave_types(*)")
    .eq("employee_id", employee.id)
    .eq("status", "approved")
    .gte("start_date", `${currentYear}-01-01`)
    .lte("start_date", `${currentYear}-12-31`)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/leaves">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leaves
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Request Leave</h1>
              <p className="text-gray-600">Submit a new leave request</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leave Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Leave Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm leaveTypes={leaveTypes || []} employeeId={employee.id} />
              </CardContent>
            </Card>
          </div>

          {/* Leave Balance Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaveTypes?.map((leaveType) => {
                  const usedDays =
                    leaveUsage
                      ?.filter((usage) => usage.leave_types?.id === leaveType.id)
                      .reduce((sum, usage) => sum + usage.days_requested, 0) || 0
                  const remainingDays = leaveType.max_days_per_year - usedDays

                  return (
                    <div key={leaveType.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{leaveType.name}</span>
                        <span className="text-muted-foreground">
                          {remainingDays}/{leaveType.max_days_per_year} days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${leaveType.max_days_per_year > 0 ? (usedDays / leaveType.max_days_per_year) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Leave requests must be submitted at least 2 weeks in advance</p>
                <p>• Sick leave does not require advance notice</p>
                <p>• Annual leave can be carried forward to next year</p>
                <p>• All leave requests require manager approval</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
