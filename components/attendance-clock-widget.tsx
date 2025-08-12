"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, LogIn, LogOut, Coffee, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  check_in_time: string | null
  check_out_time: string | null
  break_duration: number
  total_hours: number | null
  status: string
  notes: string | null
}

interface AttendanceClockWidgetProps {
  employeeId: string
  todayAttendance: AttendanceRecord | null
  employeeName: string
}

export function AttendanceClockWidget({ employeeId, todayAttendance, employeeName }: AttendanceClockWidgetProps) {
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(todayAttendance)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClockIn = async () => {
    setLoading(true)
    try {
      const now = new Date().toISOString()
      const today = new Date().toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("attendance")
        .insert({
          employee_id: employeeId,
          date: today,
          check_in_time: now,
          status: "present",
        })
        .select()
        .single()

      if (error) throw error

      setAttendance(data)
      toast({
        title: "Clocked In",
        description: `Welcome! You clocked in at ${new Date(now).toLocaleTimeString()}`,
      })
    } catch (error) {
      console.error("Error clocking in:", error)
      toast({
        title: "Error",
        description: "Failed to clock in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!attendance) return

    setLoading(true)
    try {
      const now = new Date().toISOString()
      const checkInTime = new Date(attendance.check_in_time!)
      const checkOutTime = new Date(now)
      const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

      const { data, error } = await supabase
        .from("attendance")
        .update({
          check_out_time: now,
          total_hours: Number.parseFloat(totalHours.toFixed(2)),
        })
        .eq("id", attendance.id)
        .select()
        .single()

      if (error) throw error

      setAttendance(data)
      toast({
        title: "Clocked Out",
        description: `Good job today! You worked ${totalHours.toFixed(1)} hours.`,
      })
    } catch (error) {
      console.error("Error clocking out:", error)
      toast({
        title: "Error",
        description: "Failed to clock out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isCheckedIn = attendance?.check_in_time && !attendance?.check_out_time
  const isCheckedOut = attendance?.check_in_time && attendance?.check_out_time

  const getWorkingHours = () => {
    if (!attendance?.check_in_time) return "0:00"

    const checkInTime = new Date(attendance.check_in_time)
    const endTime = attendance.check_out_time ? new Date(attendance.check_out_time) : currentTime
    const diffMs = endTime.getTime() - checkInTime.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}:${minutes.toString().padStart(2, "0")}`
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Time Clock</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Time & Employee Info */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-sm text-gray-600 mb-4">{currentTime.toLocaleDateString()}</div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{employeeName}</span>
            </div>
          </div>

          {/* Clock In/Out Actions */}
          <div className="flex flex-col items-center space-y-4">
            {!attendance?.check_in_time ? (
              <Button
                onClick={handleClockIn}
                disabled={loading}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Clock In
              </Button>
            ) : !attendance?.check_out_time ? (
              <Button
                onClick={handleClockOut}
                disabled={loading}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Clock Out
              </Button>
            ) : (
              <div className="text-center">
                <Badge variant="default" className="mb-2">
                  Day Complete
                </Badge>
                <p className="text-sm text-gray-600">You've completed your work day</p>
              </div>
            )}

            {isCheckedIn && (
              <Button variant="outline" size="sm" disabled>
                <Coffee className="h-4 w-4 mr-2" />
                Break (Coming Soon)
              </Button>
            )}
          </div>

          {/* Today's Summary */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">Today's Summary</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check In:</span>
                <span className="font-medium">
                  {attendance?.check_in_time
                    ? new Date(attendance.check_in_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check Out:</span>
                <span className="font-medium">
                  {attendance?.check_out_time
                    ? new Date(attendance.check_out_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hours Worked:</span>
                <span className="font-medium text-blue-600">{getWorkingHours()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  variant={
                    attendance?.status === "present"
                      ? "default"
                      : attendance?.status === "late"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {attendance?.status || "Not Started"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
