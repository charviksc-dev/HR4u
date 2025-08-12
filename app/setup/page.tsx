"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Users, MapPin, Briefcase } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CompanySetupPage() {
  const [companyOpen, setCompanyOpen] = useState(false)
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [designationOpen, setDesignationOpen] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      company: formData.get("company"),
      abbr: formData.get("abbr"),
      defaultCurrency: formData.get("defaultCurrency"),
      country: formData.get("country"),
    }

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Company created successfully!" })
        setCompanyOpen(false)
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Failed to create company", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      departmentName: formData.get("departmentName"),
      description: formData.get("description"),
    }

    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Department created successfully!" })
        setDepartmentOpen(false)
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Failed to create department", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDesignationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      designation: formData.get("designation"),
      appraisalTemplate: formData.get("appraisalTemplate"),
    }

    try {
      const response = await fetch("/api/designations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Designation created successfully!" })
        setDesignationOpen(false)
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Failed to create designation", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleBranchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      branch: formData.get("branch"),
    }

    try {
      const response = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Branch created successfully!" })
        setBranchOpen(false)
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Failed to create branch", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error occurred", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Setup</h1>
          <p className="text-gray-600">Set up your company details, branches, departments, and designations.</p>
        </div>

        <div className="mb-8">
          <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
            Domain Name
          </Label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <Input type="text" name="domain" id="domain" className="flex-1 rounded-l-md" placeholder="your-company" />
            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              .hr4u.app
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Company Setup Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Company</CardTitle>
                  <CardDescription className="text-sm">
                    Provide your company's basic information and branding
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={companyOpen} onOpenChange={setCompanyOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Setup Company</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Company</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCompanySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company *</Label>
                        <Input id="company" name="company" placeholder="Company name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abbr">Abbr *</Label>
                        <Input id="abbr" name="abbr" placeholder="Company abbreviation" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="defaultCurrency">Default Currency *</Label>
                        <Select name="defaultCurrency" defaultValue="USD">
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select name="country" defaultValue="india">
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="india">India</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="germany">Germany</SelectItem>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="japan">Japan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setCompanyOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Branch Setup Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Branch</CardTitle>
                  <CardDescription className="text-sm">
                    Add and manage different office locations or branches
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={branchOpen} onOpenChange={setBranchOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Manage Branches</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Branch</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBranchSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch *</Label>
                      <Input id="branch" name="branch" placeholder="Branch name" required />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setBranchOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Department Setup Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Department</CardTitle>
                  <CardDescription className="text-sm">
                    Define the various departments within your organization
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={departmentOpen} onOpenChange={setDepartmentOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Manage Departments</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Department</DialogTitle>
                    <p className="text-sm text-gray-600">Create a new department for your organization</p>
                  </DialogHeader>
                  <form onSubmit={handleDepartmentSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="departmentName">Department Name *</Label>
                      <Input id="departmentName" name="departmentName" placeholder="Enter department name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter department description"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setDepartmentOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Designation Setup Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Designation</CardTitle>
                  <CardDescription className="text-sm">Create job titles and roles for your employees</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={designationOpen} onOpenChange={setDesignationOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Manage Designations</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Designation</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleDesignationSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation *</Label>
                      <Input id="designation" name="designation" placeholder="Job title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appraisalTemplate">Appraisal Template</Label>
                      <Select name="appraisalTemplate">
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Template</SelectItem>
                          <SelectItem value="manager">Manager Template</SelectItem>
                          <SelectItem value="senior">Senior Template</SelectItem>
                          <SelectItem value="executive">Executive Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setDesignationOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
