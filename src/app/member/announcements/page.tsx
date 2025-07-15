import PaginatedAnnouncementList from "@/components/PaginatedAnnouncementList";

export default function MemberAnnouncementsPage() {
  return (
    <section className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <PaginatedAnnouncementList />
    </section>
  );
}