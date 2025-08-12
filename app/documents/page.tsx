"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationSidebar } from "@/components/navigation-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Upload, Search, Calendar, User, BookOpen } from "lucide-react"

export default function DocumentsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUser(user)

        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Mock document data - in a real app, this would come from the database
  const companyDocuments = [
    {
      id: 1,
      name: "Employee Handbook",
      description: "Complete guide to company policies and procedures",
      type: "Policy",
      size: "2.4 MB",
      lastUpdated: "2024-01-15",
      category: "handbook",
    },
    {
      id: 2,
      name: "Code of Conduct",
      description: "Professional behavior guidelines and ethics",
      type: "Policy",
      size: "1.2 MB",
      lastUpdated: "2024-01-10",
      category: "policy",
    },
    {
      id: 3,
      name: "Benefits Overview",
      description: "Comprehensive benefits package information",
      type: "Benefits",
      size: "3.1 MB",
      lastUpdated: "2024-01-20",
      category: "benefits",
    },
    {
      id: 4,
      name: "Leave Policy",
      description: "Vacation, sick leave, and time-off policies",
      type: "Policy",
      size: "800 KB",
      lastUpdated: "2024-01-12",
      category: "policy",
    },
  ]

  const personalDocuments = [
    {
      id: 5,
      name: "Employment Contract",
      description: "Your signed employment agreement",
      type: "Contract",
      size: "1.5 MB",
      lastUpdated: "2023-12-01",
      category: "personal",
    },
    {
      id: 6,
      name: "Tax Documents 2024",
      description: "W-2 and tax-related documents",
      type: "Tax",
      size: "900 KB",
      lastUpdated: "2024-01-31",
      category: "personal",
    },
  ]

  const filteredCompanyDocs = companyDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPersonalDocs = personalDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NavigationSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading documents...</div>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-600">Access company policies, forms, and your personal documents</p>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs defaultValue="company" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="company">Company Documents</TabsTrigger>
                <TabsTrigger value="personal">My Documents</TabsTrigger>
                <TabsTrigger value="forms">Forms & Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="company" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanyDocs.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <FileText className="h-8 w-8 text-orange-500" />
                          <Badge variant="secondary">{doc.type}</Badge>
                        </div>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>{doc.size}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredCompanyDocs.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPersonalDocs.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <User className="h-8 w-8 text-orange-500" />
                          <Badge variant="secondary">{doc.type}</Badge>
                        </div>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>{doc.size}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPersonalDocs.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No personal documents</h3>
                      <p className="text-gray-600">Your personal documents will appear here once uploaded.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="forms" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <BookOpen className="h-8 w-8 text-orange-500" />
                        <Badge variant="secondary">Form</Badge>
                      </div>
                      <CardTitle className="text-lg">Leave Request Form</CardTitle>
                      <CardDescription>Submit time-off requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <BookOpen className="h-8 w-8 text-orange-500" />
                        <Badge variant="secondary">Form</Badge>
                      </div>
                      <CardTitle className="text-lg">Expense Report</CardTitle>
                      <CardDescription>Report business expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <BookOpen className="h-8 w-8 text-orange-500" />
                        <Badge variant="secondary">Form</Badge>
                      </div>
                      <CardTitle className="text-lg">Performance Review</CardTitle>
                      <CardDescription>Self-assessment form</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
