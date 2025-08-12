"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface AIInsight {
  id: string
  type: "recommendation" | "alert" | "trend" | "achievement"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  metric?: string
  change?: number
}

export function AIInsightsWidget() {
  const insights: AIInsight[] = [
    {
      id: "1",
      type: "trend",
      title: "Attendance Improvement",
      description: "Team attendance has improved by 12% this month compared to last month.",
      priority: "medium",
      metric: "attendance",
      change: 12,
    },
    {
      id: "2",
      type: "recommendation",
      title: "Leave Pattern Analysis",
      description:
        "Consider implementing flexible work arrangements for the Engineering team to reduce leave requests.",
      priority: "high",
    },
    {
      id: "3",
      type: "alert",
      title: "Payroll Processing Due",
      description: "Monthly payroll processing is due in 3 days. 15 employees pending approval.",
      priority: "high",
    },
    {
      id: "4",
      type: "achievement",
      title: "Zero Overtime This Week",
      description: "Congratulations! No overtime hours recorded this week across all departments.",
      priority: "low",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-4 w-4" />
      case "recommendation":
        return <Brain className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "achievement":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="ai-insight-card text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Insights</span>
        </CardTitle>
        <CardDescription className="text-gray-200">
          Smart recommendations and analytics for your HR operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getIcon(insight.type)}
                <h4 className="font-medium">{insight.title}</h4>
              </div>
              <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
            </div>
            <p className="text-sm text-gray-200 mb-2">{insight.description}</p>
            {insight.change && (
              <div className="flex items-center space-x-1">
                {insight.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-300" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-300" />
                )}
                <span className="text-xs font-medium">
                  {insight.change > 0 ? "+" : ""}
                  {insight.change}%
                </span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
