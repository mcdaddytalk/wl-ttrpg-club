import PaginatedAnnouncementList from "@/components/PaginatedAnnouncementList";
import { Suspense } from "react";

export default function MemberAnnouncementsPage() {
  return (
    <section className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<p>Loading announcements...</p>}>
        <PaginatedAnnouncementList />
      </Suspense>
    </section>
  );
}