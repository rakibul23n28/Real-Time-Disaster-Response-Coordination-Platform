import { FormEvent, useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { apiClient, type TrainingEnrollment, type TrainingEvent, type TrainingEnrollmentStatus } from "../../lib/api";
import { useToast } from "../../components/common/Toast";

const initialForm = { title: "", description: "", location: "", district: "", start_date: "", end_date: "", duration_days: 4, capacity: 30 };
const statusLabels: Record<TrainingEnrollmentStatus, string> = { registered: "নিবন্ধিত", in_progress: "চলমান", completed: "সনদপ্রাপ্ত" };

export default function AdminTraining() {
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const [nextEvents, nextEnrollments] = await Promise.all([apiClient.getTrainingEvents(), apiClient.getTrainingEnrollments()]);
      setEvents(nextEvents);
      setEnrollments(nextEnrollments);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "প্রশিক্ষণ তথ্য লোড করা যায়নি", "error");
    }
  };
  useEffect(() => { void load(); }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const created = await apiClient.createTrainingEvent(form);
      setEvents((current) => [created, ...current]);
      setForm(initialForm);
      showToast("নতুন প্রশিক্ষণ ইভেন্ট চালু হয়েছে", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "ইভেন্ট তৈরি করা যায়নি", "error");
    } finally { setSaving(false); }
  };

  const confirm = async (id: number) => {
    try {
      const updated = await apiClient.updateTrainingEnrollment(id, "completed");
      setEnrollments((current) => current.map((item) => item.id === id ? { ...item, ...updated } : item));
      showToast("প্রশিক্ষণ নিশ্চিত হয়েছে। স্বেচ্ছাসেবক এখন কাজের জন্য প্রস্তুত।", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "প্রশিক্ষণ নিশ্চিত করা যায়নি", "error");
    }
  };

  const readyCount = enrollments.filter((item) => item.status !== "completed" && item.completed_days >= item.duration_days).length;
  return <div className="max-w-6xl space-y-6">
    <PageHeader title="স্বেচ্ছাসেবক প্রশিক্ষণ" subtitle="প্রতিটি স্বেচ্ছাসেবকের দিনের অগ্রগতি দেখুন এবং সম্পূর্ণ হলে একবারের জন্য সনদ নিশ্চিত করুন।" />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <SummaryCard label="চালু ইভেন্ট" value={events.filter((item) => item.status === "open").length} tone="green" />
      <SummaryCard label="মোট প্রশিক্ষণার্থী" value={enrollments.length} tone="blue" />
      <SummaryCard label="নিশ্চিত করার জন্য প্রস্তুত" value={readyCount} tone="amber" />
      <SummaryCard label="সনদপ্রাপ্ত" value={enrollments.filter((item) => item.status === "completed").length} tone="dark" />
    </div>
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={create} className="rounded-2xl border border-[#DCE6E0] bg-white p-5 shadow-[0_8px_30px_rgba(25,61,45,0.05)]">
        <h2 className="text-lg font-semibold text-[#17221D]">নতুন ইভেন্ট চালু করুন</h2>
        <p className="mb-5 mt-1 text-sm text-[#66736D]">স্বেচ্ছাসেবকরা এখান থেকে একটি ইভেন্ট বেছে নেবে।</p>
        <div className="space-y-3">
          <Field label="ইভেন্টের নাম"><input required className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="যেমন: বন্যা প্রস্তুতি - সিলেট" /></Field>
          <Field label="বিবরণ"><textarea required minLength={10} className="input-base min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="প্রশিক্ষণ স্থান"><input required className="input-base" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field><Field label="জেলা"><input required className="input-base" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></Field></div>
          <div className="grid grid-cols-2 gap-3"><Field label="শুরুর তারিখ"><input required type="date" className="input-base" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></Field><Field label="শেষ তারিখ"><input required type="date" className="input-base" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></Field></div>
          <div className="grid grid-cols-2 gap-3"><Field label="দিন"><input required min={1} max={30} type="number" className="input-base" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} /></Field><Field label="সর্বোচ্চ আসন"><input required min={1} type="number" className="input-base" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></Field></div>
          <Button type="submit" className="mt-2 w-full" loading={saving}>ইভেন্ট প্রকাশ করুন</Button>
        </div>
      </form>
      <section className="space-y-4"><div><h2 className="text-lg font-semibold text-[#17221D]">চালু করা ইভেন্ট</h2><p className="text-sm text-[#66736D]">লোকেশন ও আসনসহ ইভেন্টের সারাংশ</p></div>{events.map((event) => <EventSummary key={event.id} event={event} />)}</section>
    </div>
    <section className="overflow-hidden rounded-2xl border border-[#DCE6E0] bg-white shadow-[0_8px_30px_rgba(25,61,45,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE6E0] px-5 py-4"><div><h2 className="font-semibold text-[#17221D]">প্রশিক্ষণ অগ্রগতি ও নিশ্চিতকরণ</h2><p className="mt-1 text-sm text-[#66736D]">দিন সম্পূর্ণ হওয়ার পরেই অ্যাডমিন সনদ নিশ্চিত করতে পারবেন।</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">প্রস্তুত {readyCount}</span></div>
      <div className="grid gap-4 p-5 md:grid-cols-2">{enrollments.length === 0 ? <p className="md:col-span-2 py-6 text-center text-sm text-[#66736D]">এখনও কেউ প্রশিক্ষণে নিবন্ধন করেনি।</p> : enrollments.map((item) => <EnrollmentCard key={item.id} item={item} onConfirm={() => void confirm(item.id)} />)}</div>
    </section>
  </div>;
}

function EnrollmentCard({ item, onConfirm }: { item: TrainingEnrollment; onConfirm: () => void }) {
  const completedDays = Number(item.completed_days ?? 0);
  const duration = Number(item.duration_days ?? 0);
  const progress = duration ? Math.min(100, (completedDays / duration) * 100) : 0;
  const ready = item.status !== "completed" && completedDays >= duration;
  return <article className="rounded-xl border border-[#E2EBE5] bg-[#FBFDFC] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#17221D]">{item.volunteer_name}</h3><p className="mt-1 text-xs text-[#66736D]">{item.event_title}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.status === "completed" ? "bg-[#E8F5E9] text-[#2E7D5B]" : ready ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{item.status === "completed" ? "সনদপ্রাপ্ত" : ready ? "নিশ্চিত করা যাবে" : statusLabels[item.status]}</span></div><div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#4C5B53]"><span>দিনের অগ্রগতি</span><span>{completedDays}/{duration} দিন</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5EEE8]"><div className={`h-full rounded-full transition-all ${item.status === "completed" ? "bg-[#2E7D5B]" : ready ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${progress}%` }} /></div><div className="mt-4 flex flex-wrap gap-1.5">{Array.from({ length: duration }, (_, index) => <span key={index} className={`flex size-7 items-center justify-center rounded-full text-[11px] font-bold ${index < completedDays ? "bg-[#2E7D5B] text-white" : "bg-white text-[#839188] ring-1 ring-[#DCE6E0]"}`}>{index < completedDays ? "✓" : index + 1}</span>)}</div><div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E7EFE9] pt-3"><span className="text-xs text-[#66736D]">📍 {item.location}</span>{item.status === "completed" ? <span className="text-xs font-semibold text-[#2E7D5B]">প্রশিক্ষণ নিশ্চিত</span> : <Button size="sm" onClick={onConfirm} disabled={!ready}>{ready ? "প্রশিক্ষণ নিশ্চিত করুন" : "দিন পূর্ণ হয়নি"}</Button>}</div></article>;
}

function EventSummary({ event }: { event: TrainingEvent }) { return <div className="rounded-xl border border-[#DCE6E0] bg-white p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#17221D]">{event.title}</h3><p className="mt-1 text-sm text-[#66736D]">📍 {event.location}, {event.district}</p></div><span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-xs font-semibold text-[#2E7D5B]">{event.status}</span></div><div className="mt-3 flex items-center justify-between text-xs text-[#66736D]"><span>{event.duration_days} দিনের প্রশিক্ষণ</span><span>{event.enrolled_count}/{event.capacity} আসন</span></div><div className="mt-2 h-1.5 rounded-full bg-[#E5EEE8]"><div className="h-full rounded-full bg-[#2E7D5B]" style={{ width: `${Math.min(100, Number(event.enrolled_count) / Number(event.capacity) * 100)}%` }} /></div></div>; }
function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "green" | "blue" | "amber" | "dark" }) { const colors = { green: "text-[#2E7D5B]", blue: "text-blue-600", amber: "text-amber-600", dark: "text-[#17221D]" }; return <div className="rounded-xl border border-[#DCE6E0] bg-white p-4"><p className={`text-2xl font-bold ${colors[tone]}`}>{value}</p><p className="mt-1 text-xs text-[#66736D]">{label}</p></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-[#33443B]">{label}<span className="mt-1 block">{children}</span></label>; }
