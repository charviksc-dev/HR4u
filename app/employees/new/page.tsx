import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AddEmployeeForm } from "@/components/add-employee-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function NewEmployeePage() {
  const supabase = createClient()
  let user = null
  let hasPermission = true
  let departments: any[] = []
  let authError = false

  try {
    const {
      data: { user: userData },
    } = await supabase.auth.getUser()
    user = userData
  } catch (error) {
    console.log("Auth check failed:", error)
    authError = true
  }

  if (!user && !authError) {
    authError = true
  }

  if (user) {
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      if (profile && profile.role !== "admin" && profile.role !== "hr") {
        hasPermission = false
      }
    } catch (error) {
      console.log("Profile check failed, allowing access:", error)
      // If profile table doesn't exist, allow access for now
    }
  }

  try {
    const { data: deptData } = await supabase.from("departments").select("id, name").order("name")
    departments = deptData || []
  } catch (error) {
    console.log("Departments table not found, using empty array:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/employees">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employees
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
              <p className="text-gray-600">Create a new employee record</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {authError && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Authentication not available. You can still use this form, but data may not be saved properly.
              <Link href="/auth/login" className="ml-2 text-orange-600 hover:text-orange-800 underline">
                Login here
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {!hasPermission && user && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You may not have permission to add employees. Contact your administrator if you need access.
            </AlertDescription>
          </Alert>
        )}

        {departments.length === 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              No departments found. The database may not be set up yet.
              <Link href="/setup" className="ml-2 text-orange-600 hover:text-orange-800 underline">
                Run setup
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <AddEmployeeForm departments={departments} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
