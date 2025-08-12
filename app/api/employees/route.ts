import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.json()

    // Generate employee ID if not provided
    const employeeId = formData.employeeNumber || `${formData.series}${Date.now().toString().slice(-6)}`

    // Prepare employee data
    const employeeData = {
      employee_id: employeeId,
      first_name: formData.firstName,
      middle_name: formData.middleName || null,
      last_name: formData.lastName || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      date_of_birth: formData.dateOfBirth || null,
      hire_date: formData.dateOfJoining,
      job_title: formData.designation || "Employee",
      department_id: null, // Will be set based on department name
      salary: formData.salary ? Number.parseFloat(formData.salary) : null,
      employment_type: formData.employmentType || "full-time",
      status: formData.status?.toLowerCase() || "active",
      gender: formData.gender || null,
      salutation: formData.salutation || null,
      company: formData.company || null,
      branch: formData.branch || null,
      reports_to: formData.reportsTo || null,
      grade: formData.grade || null,
      blood_group: formData.bloodGroup || null,
      marital_status: formData.maritalStatus || null,
      nationality: formData.nationality || null,
      bio: formData.bio || null,
      skills: formData.skills || null,
    }

    // Try to find department ID if department name is provided
    if (formData.department) {
      try {
        const { data: dept } = await supabase.from("departments").select("id").eq("name", formData.department).single()

        if (dept) {
          employeeData.department_id = dept.id
        }
      } catch (error) {
        console.log("Department lookup failed, continuing without department_id")
      }
    }

    // Insert employee
    const { data, error } = await supabase.from("employees").insert(employeeData).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message || "Failed to create employee" }, { status: 500 })
    }

    return NextResponse.json({ success: true, employee: data })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
