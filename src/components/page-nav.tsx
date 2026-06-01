import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToEventsLink() {
  return (
    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-ink">
      <ArrowLeft aria-hidden="true" size={16} />
      Back to events
    </Link>
  );
}
