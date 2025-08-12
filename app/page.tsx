import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Clock, FileText, BarChart3, Building2, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl rotate-45 flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 bg-white rounded-lg -rotate-45"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                HR4u
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              HR Operations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Comprehensive HR management platform designed for modern businesses. Streamline employee management, track
            attendance, and gain powerful insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 text-lg shadow-xl"
            >
              Launch Dashboard
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
          <Link href="/setup">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-10 py-4 text-lg bg-white/50 backdrop-blur-sm"
            >
              <Building2 className="mr-3 h-6 w-6" />
              Setup Company
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link href="/employees" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Employee Management</h3>
              <p className="text-gray-600">
                Complete workforce management with profiles, roles, and organizational structure
              </p>
            </div>
          </Link>

          <Link href="/attendance" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time & Attendance</h3>
              <p className="text-gray-600">
                Track working hours, shifts, and attendance patterns with real-time monitoring
              </p>
            </div>
          </Link>

          <Link href="/leaves" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Leave Management</h3>
              <p className="text-gray-600">Streamlined leave requests, approvals, and balance tracking system</p>
            </div>
          </Link>

          <Link href="/payroll" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Payroll & Benefits</h3>
              <p className="text-gray-600">Automated payroll processing with tax calculations and benefit management</p>
            </div>
          </Link>

          <Link href="/reports" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600">Comprehensive insights and reporting for data-driven HR decisions</p>
            </div>
          </Link>

          <Link href="/profile" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Self-Service Portal</h3>
              <p className="text-gray-600">Employee self-service for profile management and document access</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-orange-100 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm -rotate-45"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">HR4u</span>
          </div>
          <p className="text-gray-600">© 2024 HR4u. All rights reserved. Empowering modern HR management.</p>
        </div>
      </footer>
    </div>
  )
}
