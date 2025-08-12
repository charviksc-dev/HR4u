"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"
import { Loader2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Log In"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-orange-500 p-2 rounded transform rotate-45">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-900">HR4u</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Login to access your HR dashboard.</p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{state.error}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Username
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your username"
            required
            className="w-full h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Link href="/auth/forgot-password" className="text-orange-500 hover:text-orange-600 text-sm">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="w-full h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-3">
          <SubmitButton />

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
          >
            Log in with LDAP
          </Button>
        </div>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/auth/sign-up" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign Up
          </Link>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">© 2024 HR4u. All Rights Reserved.</div>
    </div>
  )
}
