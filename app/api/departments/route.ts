import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.json()

    const departmentData = {
      name: formData.departmentName,
      description: formData.description || null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("departments").insert(departmentData).select().single()

    if (error) {
      console.error("Database error:", error)

      if (error.message?.includes("Could not find the table") || error.message?.includes("schema cache")) {
        return NextResponse.json(
          {
            error: "Database not initialized. Please run the database setup scripts first.",
            setupRequired: true,
          },
          { status: 400 },
        )
      }

      return NextResponse.json({ error: error.message || "Failed to create department" }, { status: 500 })
    }

    return NextResponse.json({ success: true, department: data })
  } catch (error: any) {
    console.error("API error:", error)

    if (error.message?.includes("Could not find the table") || error.message?.includes("schema cache")) {
      return NextResponse.json(
        {
          error: "Database not initialized. Please run the database setup scripts first.",
          setupRequired: true,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
