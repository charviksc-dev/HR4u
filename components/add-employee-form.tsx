"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Loader2, ChevronDown, Menu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Department {
  id: string
  name: string
}

interface AddEmployeeFormProps {
  departments: Department[]
}

export function AddEmployeeForm({ departments }: AddEmployeeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(true)

  const [formData, setFormData] = useState({
    // Overview fields
    series: "INT-",
    employeeNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    dateOfJoining: "",
    status: "Active",
    salutation: "",

    // Company Details
    company: "Innopay Technologies Pvt Ltd",
    designation: "",
    branch: "",
    department: "",
    reportsTo: "",
    grade: "",
    employmentType: "full-time",

    // Address & Contacts
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Salary
    salary: "",
    currency: "INR",

    // Personal
    bloodGroup: "",
    maritalStatus: "",
    nationality: "Indian",
    religion: "",

    // Profile
    bio: "",
    skills: "",

    // Attendance & Leaves
    attendanceDeviceId: "",
    holidayList: "",
    applicableHolidayList: "",
    defaultShift: "",
    expenseApprover: "",
    shiftRequestApprover: "",
    leaveApprover: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create employee")
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: "Employee created successfully",
      })

      router.push("/employees")
    } catch (error: any) {
      console.error("Error creating employee:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create employee. Please try again.",
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="h-5 w-5 text-gray-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">New Employee</h1>
              <span className="text-sm text-red-500">Not Saved</span>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white border border-gray-200 rounded-lg p-1 mb-6 gap-1">
            <TabsTrigger
              value="overview"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="joining"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Joining
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Address
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="salary"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Salary
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="exit"
              className="text-xs lg:text-sm px-2 py-1 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
            >
              Exit
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="series">Series</Label>
                      <Select value={formData.series} onValueChange={(value) => handleInputChange("series", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INT-">INT-.###</SelectItem>
                          <SelectItem value="EMP-">EMP-.###</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="gender">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfJoining">
                        Date of Joining <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateOfJoining"
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salutation">Salutation</Label>
                      <Select
                        value={formData.salutation}
                        onValueChange={(value) => handleInputChange("salutation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select salutation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Ms.">Ms.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                          <SelectItem value="Dr.">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Details Collapsible */}
              <Collapsible open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:border-orange-200 transition-colors">
                  <h3 className="text-lg font-medium">User Details</h3>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform text-orange-500 ${userDetailsOpen ? "rotate-180" : ""}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Company Details */}
              <Collapsible open={companyDetailsOpen} onOpenChange={setCompanyDetailsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:border-orange-200 transition-colors">
                  <h3 className="text-lg font-medium">Company Details</h3>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform text-orange-500 ${companyDetailsOpen ? "rotate-180" : ""}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="company">
                            Company <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="designation">Designation</Label>
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={(e) => handleInputChange("designation", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Input
                            id="branch"
                            value={formData.branch}
                            onChange={(e) => handleInputChange("branch", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => handleInputChange("department", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.name}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                              {departments.length === 0 && <SelectItem value="General">General</SelectItem>}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="reportsTo">Reports to</Label>
                          <Input
                            id="reportsTo"
                            value={formData.reportsTo}
                            onChange={(e) => handleInputChange("reportsTo", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade">Grade</Label>
                          <Input
                            id="grade"
                            value={formData.grade}
                            onChange={(e) => handleInputChange("grade", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <Label htmlFor="employmentType">Employment Type</Label>
                          <Select
                            value={formData.employmentType}
                            onValueChange={(value) => handleInputChange("employmentType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="employeeNumber">
                            Employee Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="employeeNumber"
                            value={formData.employeeNumber}
                            onChange={(e) => handleInputChange("employeeNumber", e.target.value)}
                            placeholder="Auto-generated if empty"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* Other tabs content - simplified for now */}
            <TabsContent value="joining" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Joining Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Address & Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salary" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Salary Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="salary">Annual Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(value) => handleInputChange("bloodGroup", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={formData.maritalStatus}
                        onValueChange={(value) => handleInputChange("maritalStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        placeholder="Brief description about the employee"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        rows={3}
                        placeholder="List of skills separated by commas"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Attendance & Leave Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="attendanceDeviceId">Attendance Device ID (Biometric/RF tag ID)</Label>
                      <Input
                        id="attendanceDeviceId"
                        name="attendanceDeviceId"
                        value={formData.attendanceDeviceId || ""}
                        onChange={(e) => handleInputChange("attendanceDeviceId", e.target.value)}
                        placeholder="Enter device ID"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="holidayList">Holiday List</Label>
                      <Input
                        id="holidayList"
                        name="holidayList"
                        value={formData.holidayList || ""}
                        onChange={(e) => handleInputChange("holidayList", e.target.value)}
                        placeholder="Select holiday list"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applicableHolidayList">Applicable Holiday List</Label>
                      <Input
                        id="applicableHolidayList"
                        name="applicableHolidayList"
                        value={formData.applicableHolidayList || ""}
                        onChange={(e) => handleInputChange("applicableHolidayList", e.target.value)}
                        placeholder="Select applicable holiday list"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="defaultShift">Default Shift</Label>
                      <Input
                        id="defaultShift"
                        name="defaultShift"
                        value={formData.defaultShift || ""}
                        onChange={(e) => handleInputChange("defaultShift", e.target.value)}
                        placeholder="Select default shift"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-md font-medium mb-4">Approvers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="expenseApprover">Expense Approver</Label>
                        <Input
                          id="expenseApprover"
                          name="expenseApprover"
                          value={formData.expenseApprover || ""}
                          onChange={(e) => handleInputChange("expenseApprover", e.target.value)}
                          placeholder="Select expense approver"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shiftRequestApprover">Shift Request Approver</Label>
                        <Input
                          id="shiftRequestApprover"
                          name="shiftRequestApprover"
                          value={formData.shiftRequestApprover || ""}
                          onChange={(e) => handleInputChange("shiftRequestApprover", e.target.value)}
                          placeholder="Select shift request approver"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leaveApprover">Leave Approver</Label>
                        <Input
                          id="leaveApprover"
                          name="leaveApprover"
                          value={formData.leaveApprover || ""}
                          onChange={(e) => handleInputChange("leaveApprover", e.target.value)}
                          placeholder="Select leave approver"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exit" className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Exit Information</h3>
                  <p className="text-gray-600">
                    Exit information will be filled when employee leaves the organization.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
