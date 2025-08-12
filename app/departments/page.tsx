"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users, Building2, Edit, Trash2, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface Department {
  id: string
  name: string
  description: string
  manager_id: string | null
  employee_count: number
  created_at: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), 5000))

      const queryPromise = supabase
        .from("departments")
        .select(`
          *,
          employee_count:employees(count)
        `)
        .order("name")

      const { data, error } = (await Promise.race([queryPromise, timeoutPromise])) as any

      if (error) {
        if (error.message?.includes("table") || error.message?.includes("schema")) {
          console.warn("Database tables not found - using fallback data")
          setDepartments([])
          return
        }
        throw error
      }

      const formattedData =
        data?.map((dept) => ({
          ...dept,
          employee_count: dept.employee_count?.[0]?.count || 0,
        })) || []

      setDepartments(formattedData)
    } catch (error) {
      console.error("Error fetching departments:", error)
      setDepartments([])

      if (
        !error.message?.includes("table") &&
        !error.message?.includes("schema") &&
        !error.message?.includes("timeout")
      ) {
        toast({
          title: "Error",
          description: "Failed to load departments",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), 5000))

      const insertPromise = supabase.from("departments").insert([
        {
          name: newDepartment.name.trim(),
          description: newDepartment.description.trim(),
        },
      ])

      const { error } = (await Promise.race([insertPromise, timeoutPromise])) as any

      if (error) {
        if (error.message?.includes("table") || error.message?.includes("schema")) {
          toast({
            title: "Setup Required",
            description: "Please run the database setup scripts first",
            variant: "destructive",
          })
          return
        }
        throw error
      }

      toast({
        title: "Success",
        description: "Department created successfully",
      })

      setNewDepartment({ name: "", description: "" })
      setIsCreateModalOpen(false)
      fetchDepartments()
    } catch (error) {
      console.error("Error creating department:", error)
      toast({
        title: "Error",
        description: error.message?.includes("timeout") ? "Request timed out" : "Failed to create department",
        variant: "destructive",
      })
    }
  }

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading departments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
            <p className="text-gray-600">Manage organizational departments and structure</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold">New Department</DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a new department for your organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Department Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter department name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter department description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[80px] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6" onClick={handleCreateDepartment}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.employee_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {department.description || "No description provided"}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{department.employee_count} employees</span>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "No departments match your search criteria."
              : "Get started by creating your first department or run the database setup scripts."}
          </p>
          {!searchTerm && (
            <div className="space-y-2">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
              <p className="text-sm text-gray-500">
                Note: If you're seeing this message, you may need to run the database setup scripts first.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
