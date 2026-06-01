import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { EventForm } from "@/components/event-form";
import { BackToEventsLink } from "@/components/page-nav";

export default function NewEventPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <BackToEventsLink />
      <h1 className="text-3xl font-semibold">Drop an event</h1>
      <p className="mt-2 text-sm text-neutral-600">Create an event for any date inside the launch area.</p>
      <div className="mt-6">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-ui bg-ink px-4 py-3 font-medium text-white">Sign in to create</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <EventForm />
        </SignedIn>
      </div>
    </main>
  );
}
