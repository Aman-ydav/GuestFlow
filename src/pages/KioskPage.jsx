import { useState } from 'react'
import { FiCheckCircle, FiUserPlus } from 'react-icons/fi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { RegistrationForm } from '@/features/registration'

export default function KioskPage() {
  const [lastRegistered, setLastRegistered] = useState(null)

  if (lastRegistered) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <FiCheckCircle className="size-7" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">You're registered, {lastRegistered.name.split(' ')[0]}!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your request has been sent for approval. Please take a seat — we'll let you know shortly.
          </p>
        </div>
        <StatusBadge status={lastRegistered.status} />
        <Button variant="outline" onClick={() => setLastRegistered(null)}>
          <FiUserPlus className="size-4" /> Register another visitor
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Visitor Registration</CardTitle>
          <CardDescription>Please fill in your details and take a photo to request entry.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm onRegistered={setLastRegistered} />
        </CardContent>
      </Card>
    </div>
  )
}
