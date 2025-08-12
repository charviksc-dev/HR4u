import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.json()

    const companyData = {
      name: formData.company,
      abbreviation: formData.abbr,
      default_currency: formData.defaultCurrency || "USD",
      country: formData.country || "India",
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("companies").insert(companyData).select().single()

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

      return NextResponse.json({ error: error.message || "Failed to create company" }, { status: 500 })
    }

    return NextResponse.json({ success: true, company: data })
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
