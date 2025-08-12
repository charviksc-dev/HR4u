"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavigationSidebar } from "@/components/navigation-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Mail, Phone, Building2, Users } from "lucide-react"

export default function DirectoryPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadDirectory() {
      try {
        // Load employees with department and designation info
        const { data: employeesData, error: employeesError } = await supabase
          .from("employees")
          .select(`
            *,
            departments (id, name),
            designations (id, title)
          `)
          .order("first_name")

        if (employeesError) {
          console.error("Error loading employees:", employeesError)
          setEmployees([])
        } else {
          setEmployees(employeesData || [])
          setFilteredEmployees(employeesData || [])
        }

        // Load departments for filter
        const { data: departmentsData, error: departmentsError } = await supabase
          .from("departments")
          .select("*")
          .order("name")

        if (departmentsError) {
          console.error("Error loading departments:", departmentsError)
          setDepartments([])
        } else {
          setDepartments(departmentsData || [])
        }
      } catch (error) {
        console.error("Error loading directory:", error)
        setEmployees([])
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    loadDirectory()
  }, [])

  useEffect(() => {
    let filtered = employees

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.designations?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter((employee) => employee.department_id === departmentFilter)
    }

    setFilteredEmployees(filtered)
  }, [searchTerm, departmentFilter, employees])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NavigationSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading directory...</div>
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
              <p className="text-gray-600">Find and connect with your colleagues</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredEmployees.length} of {employees.length} employees
                </span>
              </div>
            </div>

            {/* Employee Grid */}
            {filteredEmployees.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                  <p className="text-gray-600">
                    {employees.length === 0
                      ? "No employees have been added to the system yet."
                      : "Try adjusting your search criteria or filters."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>
                            {employee.first_name?.[0]}
                            {employee.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {employee.designations?.title || "No designation"}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            {employee.departments?.name || "No department"}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>ID: {employee.employee_id}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        {employee.phone && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
