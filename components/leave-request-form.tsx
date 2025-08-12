"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { Loader2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LeaveType {
  id: string
  name: string
  description: string
  max_days_per_year: number
  requires_approval: boolean
}

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[]
  employeeId: string
}

export function LeaveRequestForm({ leaveTypes, employeeId }: LeaveRequestFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const daysRequested = calculateDays(formData.startDate, formData.endDate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (daysRequested <= 0) {
        throw new Error("Please select valid dates")
      }

      const { data, error } = await supabase
        .from("leave_requests")
        .insert({
          employee_id: employeeId,
          leave_type_id: formData.leaveTypeId,
          start_date: formData.startDate,
          end_date: formData.endDate,
          days_requested: daysRequested,
          reason: formData.reason,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      })

      router.push("/leaves")
    } catch (error) {
      console.error("Error submitting leave request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit leave request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="leaveType">Leave Type *</Label>
          <Select value={formData.leaveTypeId} onValueChange={(value) => handleInputChange("leaveTypeId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              {leaveTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <div className="relative">
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <div className="relative">
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              required
              min={formData.startDate || new Date().toISOString().split("T")[0]}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        {daysRequested > 0 && (
          <div className="md:col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Total days requested: {daysRequested} {daysRequested === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <Label htmlFor="reason">Reason for Leave</Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            placeholder="Please provide a brief reason for your leave request..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/leaves")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !formData.leaveTypeId || !formData.startDate || !formData.endDate}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Request
        </Button>
      </div>
    </form>
  )
}
