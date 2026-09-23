import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { apiClient, type TrainingEvent } from "../../lib/api";
import { useToast } from "../../components/common/Toast";

const statusLabels: Record<TrainingEvent["status"], string> = { open: "আবেদন চলছে", in_progress: "চলমান", completed: "সম্পন্ন", cancelled: "বাতিল" };
const enrollmentLabels = { registered: "নিবন্ধিত", in_progress: "প্রশিক্ষণ চলছে", completed: "প্রশিক্ষণ সম্পন্ন" };

function dateRange(event: TrainingEvent) {
  return `${new Date(event.start_date).toLocaleDateString("bn-BD", { day: "numeric", month: "short" })} - ${new Date(event.end_date).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" })}`;
}

export default function VolunteerTraining() {
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<number | null>(null);
  const [completingDay, setCompletingDay] = useState<number | null>(null);
  const { showToast } = useToast();

  const load = async () => {
    try { setEvents(await apiClient.getTrainingEvents()); } catch (error) { showToast(error instanceof Error ? error.message : "প্রশিক্ষণ ইভেন্ট লোড করা যায়নি", "error"); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const join = async (id: number) => {
    setJoining(id);
    try { const updated = await apiClient.enrollInTraining(id); setEvents((current) => current.map((event) => event.id === id ? updated : event)); showToast("প্রশিক্ষণে আপনার আসন নিশ্চিত হয়েছে", "success"); }
    catch (error) { showToast(error instanceof Error ? error.message : "নিবন্ধন করা যায়নি", "error"); }
    finally { setJoining(null); }
  };

  const completeDay = async (event: TrainingEvent) => {
    if (!event.enrollment_id) return;
    setCompletingDay(event.id);
    try {
      const updated = await apiClient.completeTrainingDay(event.enrollment_id);
      setEvents((current) => current.map((item) => item.id === event.id ? { ...item, enrollment_status: updated.status, completed_days: updated.completed_days } : item));
      showToast(`দিন ${updated.completed_days} সম্পন্ন হয়েছে`, "success");
    } catch (error) { showToast(error instanceof Error ? error.message : "দিন সম্পন্ন করা যায়নি", "error"); }
    finally { setCompletingDay(null); }
  };

  const enrolled = events.filter((event) => event.enrollment_id);
  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title="স্বেচ্ছাসেবক প্রশিক্ষণ" subtitle="দুর্যোগ এলাকায় কাজের আগে আপনার সুবিধাজনক স্থান ও সময়ের প্রশিক্ষণ বেছে নিন।" />
      <div className="rounded-2xl bg-[#173F35] p-6 text-white md:p-8">
        <div className="max-w-2xl"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A9E5C2]">Field readiness program</p><h2 className="text-2xl font-bold md:text-3xl">প্রশিক্ষণ শেষ হলেই আপনি মাঠে প্রস্তুত</h2><p className="mt-3 text-sm leading-6 text-[#D6EEE0]">প্রশিক্ষণের প্রতিটি দিন সম্পন্ন করার পর অ্যাডমিন আপনার স্ট্যাটাস সম্পন্ন করবেন। তখন আপনি দুর্যোগ মোকাবিলার কাজে যোগ দিতে পারবেন।</p></div>
      </div>
      {enrolled.length > 0 && <section><h2 className="mb-3 text-lg font-semibold text-[#17221D]">আমার প্রশিক্ষণ</h2><div className="grid gap-4 md:grid-cols-2">{enrolled.map((event) => <EventCard key={event.id} event={event} onJoin={join} onCompleteDay={completeDay} joining={joining === event.id} completingDay={completingDay === event.id} />)}</div></section>}
      <section><div className="mb-3 flex items-end justify-between"><div><h2 className="text-lg font-semibold text-[#17221D]">উপলভ্য ইভেন্ট</h2><p className="text-sm text-[#66736D]">আপনার পছন্দের লোকেশনে আসন নিন</p></div><span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#2E7D5B]">{events.filter((event) => event.status === "open").length}টি খোলা</span></div>{loading ? <div className="rounded-xl border border-[#DCE6E0] bg-white p-8 text-center text-sm text-[#66736D]">ইভেন্ট লোড হচ্ছে...</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{events.filter((event) => !event.enrollment_id).map((event) => <EventCard key={event.id} event={event} onJoin={join} joining={joining === event.id} />)}</div>}</section>
    </div>
  );
}

function EventCard({ event, onJoin, onCompleteDay, joining, completingDay }: { event: TrainingEvent; onJoin: (id: number) => void; onCompleteDay?: (event: TrainingEvent) => void; joining: boolean; completingDay?: boolean }) {
  const full = Number(event.enrolled_count) >= Number(event.capacity);
  const completedDays = Number(event.completed_days ?? 0);
  const isEnrolled = Boolean(event.enrollment_id);
  return <article className="flex flex-col rounded-xl border border-[#DCE6E0] bg-white p-5 shadow-[0_8px_30px_rgba(25,61,45,0.05)]"><div className="mb-4 flex items-start justify-between gap-3"><span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-xs font-semibold text-[#2E7D5B]">{statusLabels[event.status]}</span><span className="text-xs text-[#66736D]">{event.duration_days} দিন</span></div><h3 className="text-base font-bold text-[#17221D]">{event.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-[#66736D]">{event.description}</p><div className="mt-5 space-y-2 border-t border-[#EEF3EF] pt-4 text-sm text-[#4C5B53]"><p>📍 {event.location}, {event.district}</p><p>◷ {dateRange(event)}</p><p>◉ {event.enrolled_count}/{event.capacity} আসন পূর্ণ</p></div>{isEnrolled && <div className="mt-4 rounded-xl bg-[#F4FBF6] p-3"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#2E7D5B]"><span>প্রশিক্ষণ অগ্রগতি</span><span>দিন {completedDays}/{event.duration_days}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#DCEFE2]"><div className="h-full rounded-full bg-[#2E7D5B] transition-all" style={{ width: `${Math.min(100, completedDays / event.duration_days * 100)}%` }} /></div><p className="mt-2 text-xs text-[#66736D]">{event.enrollment_status ? enrollmentLabels[event.enrollment_status] : "নিবন্ধিত"}</p></div>}{isEnrolled && event.enrollment_status !== "completed" && completedDays < event.duration_days && onCompleteDay && <Button className="mt-4 w-full" size="sm" onClick={() => onCompleteDay(event)} loading={completingDay}>আজকের দিন সম্পন্ন করুন</Button>}{event.status === "open" && !isEnrolled && <Button className="mt-5 w-full" size="sm" onClick={() => onJoin(event.id)} disabled={full || joining} loading={joining}>{full ? "আসন পূর্ণ" : "এই ইভেন্টে যোগ দিন"}</Button>}</article>;
}