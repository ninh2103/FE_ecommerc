import { cn } from "~/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { InteractiveHoverButton } from "components/magicui/interactive-hover-button"
import { RainbowButton } from "components/magicui/rainbow-button"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="max-w-md w-full mx-auto" >
        <CardHeader>
          <CardTitle>Register a new account</CardTitle>
          <CardDescription>
            Fill in the information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your name" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2 items-center">
                  <Input id="email" type="email" placeholder="m@example.com" required className="w-2/3" />
                  <InteractiveHoverButton className="w-1/3">Send</InteractiveHoverButton>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" placeholder="0123456789" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="code">Verification Code</Label>
                <Input id="code" type="text" placeholder="Enter code" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              <RainbowButton className="w-full">Register</RainbowButton>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
