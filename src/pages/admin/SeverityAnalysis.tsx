import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockIncidents } from "../../data/mockIncidents";

type DamageLevel = "low" | "medium" | "high" | "extreme";
type MedicalNeed = "yes" | "no";
type RoadStatus = "normal" | "partial" | "blocked";
type ShelterStatus = "adequate" | "limited" | "inadequate";

interface CalcInputs {
  affectedPeople: number;
  damageLevel: DamageLevel;
  medicalNeed: MedicalNeed;
  roadStatus: RoadStatus;
  shelterStatus: ShelterStatus;
}

function calculateScore(inputs: CalcInputs): number {
  let score = 0;
  if (inputs.affectedPeople >= 500) score += 30;
  else if (inputs.affectedPeople >= 200) score += 20;
  else if (inputs.affectedPeople >= 50) score += 12;
  else score += 5;

  score += { low: 5, medium: 12, high: 20, extreme: 30 }[inputs.damageLevel];
  score += inputs.medicalNeed === "yes" ? 15 : 0;
  score += { normal: 0, partial: 7, blocked: 15 }[inputs.roadStatus];
  score += { adequate: 0, limited: 5, inadequate: 10 }[inputs.shelterStatus];

  return Math.min(score, 100);
}

function scoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 75) return { label: "অতি জরুরি", color: "text-red-700", bg: "bg-red-50 border-red-200" };
  if (score >= 55) return { label: "উচ্চ", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
  if (score >= 35) return { label: "মাঝারি", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
  return { label: "কম", color: "text-green-700", bg: "bg-green-50 border-green-200" };
}

const incidentScores = mockIncidents.map((inc) => ({
  ...inc,
  score: calculateScore({
    affectedPeople: inc.affectedPeople,
    damageLevel: inc.severity === "high" ? "extreme" : inc.severity === "medium" ? "high" : "medium",
    medicalNeed: inc.severity === "high" ? "yes" : "no",
    roadStatus: inc.severity === "high" ? "blocked" : inc.severity === "medium" ? "partial" : "normal",
    shelterStatus: inc.severity === "high" ? "inadequate" : inc.severity === "medium" ? "limited" : "adequate",
  }),
})).sort((a, b) => b.score - a.score);

const maxPeople = Math.max(...mockIncidents.map((i) => i.affectedPeople));

export default function SeverityAnalysis() {
  const [inputs, setInputs] = useState<CalcInputs>({
    affectedPeople: 320,
    damageLevel: "high",
    medicalNeed: "yes",
    roadStatus: "partial",
    shelterStatus: "limited",
  });

  const score = calculateScore(inputs);
  const { label, color, bg } = scoreLabel(score);

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title="দুর্যোগের তীব্রতা বিশ্লেষণ" subtitle="আক্রান্ত এলাকার তথ্যের ভিত্তিতে অগ্রাধিকার নির্ধারণ করুন।" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator form */}
        <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
          <h2 className="font-semibold text-[#17221D] mb-4">তীব্রতা ক্যালকুলেটর</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">
                আক্রান্ত মানুষের সংখ্যা
              </label>
              <input type="number" min={0} value={inputs.affectedPeople}
                onChange={(e) => setInputs((p) => ({ ...p, affectedPeople: Number(e.target.value) }))}
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none" />
            </div>

            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">পানির স্তর / ক্ষতির মাত্রা</label>
              <select value={inputs.damageLevel} onChange={(e) => setInputs((p) => ({ ...p, damageLevel: e.target.value as DamageLevel }))}
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none bg-white">
                <option value="low">কম</option>
                <option value="medium">মাঝারি</option>
                <option value="high">বেশি</option>
                <option value="extreme">অত্যন্ত বেশি</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">জরুরি চিকিৎসা প্রয়োজন</label>
              <div className="flex gap-3">
                {(["yes", "no"] as const).map((v) => (
                  <button key={v} onClick={() => setInputs((p) => ({ ...p, medicalNeed: v }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-[9px] border-2 transition-all ${inputs.medicalNeed === v ? "border-[#2E7D5B] bg-[#E8F5E9] text-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D]"}`}>
                    {v === "yes" ? "হ্যাঁ" : "না"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">রাস্তা যোগাযোগ</label>
              <select value={inputs.roadStatus} onChange={(e) => setInputs((p) => ({ ...p, roadStatus: e.target.value as RoadStatus }))}
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none bg-white">
                <option value="normal">স্বাভাবিক</option>
                <option value="partial">আংশিক বন্ধ</option>
                <option value="blocked">সম্পূর্ণ বন্ধ</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">আশ্রয়কেন্দ্রের অবস্থা</label>
              <select value={inputs.shelterStatus} onChange={(e) => setInputs((p) => ({ ...p, shelterStatus: e.target.value as ShelterStatus }))}
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none bg-white">
                <option value="adequate">পর্যাপ্ত</option>
                <option value="limited">সীমিত</option>
                <option value="inadequate">অপর্যাপ্ত</option>
              </select>
            </div>
          </div>
        </div>

        {/* Score display */}
        <div className="space-y-4">
          <div className={`rounded-xl border p-6 text-center ${bg}`}>
            <p className="text-xs font-semibold text-[#66736D] uppercase tracking-wider mb-2">তীব্রতা স্কোর</p>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className={`text-7xl font-black ${color}`}>{score}</span>
              <span className="text-2xl text-[#66736D] mb-3">/ 100</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm ${color} border ${bg}`}>
              {score >= 75 ? "🔴" : score >= 55 ? "🟠" : score >= 35 ? "🟡" : "🟢"} {label}
            </div>
            <div className="mt-4 w-full h-3 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${score}%`,
                backgroundColor: score >= 75 ? "#DC2626" : score >= 55 ? "#F59E0B" : score >= 35 ? "#EAB308" : "#16A34A"
              }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-3">স্কোরের বিভাজন</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "আক্রান্ত জনসংখ্যা", points: inputs.affectedPeople >= 500 ? 30 : inputs.affectedPeople >= 200 ? 20 : inputs.affectedPeople >= 50 ? 12 : 5 },
                { label: "ক্ষতির মাত্রা", points: { low: 5, medium: 12, high: 20, extreme: 30 }[inputs.damageLevel] },
                { label: "চিকিৎসার প্রয়োজন", points: inputs.medicalNeed === "yes" ? 15 : 0 },
                { label: "যোগাযোগ ব্যবস্থা", points: { normal: 0, partial: 7, blocked: 15 }[inputs.roadStatus] },
                { label: "আশ্রয়কেন্দ্র", points: { adequate: 0, limited: 5, inadequate: 10 }[inputs.shelterStatus] },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1 border-b border-[#F4FBF6] last:border-0">
                  <span className="text-[#66736D]">{row.label}</span>
                  <span className="font-bold text-[#17221D]">+{row.points}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 font-bold">
                <span className="text-[#17221D]">মোট স্কোর</span>
                <span className={color}>{score} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {(["high", "medium", "low"] as const).map((s) => {
          const count = mockIncidents.filter((i) => i.severity === s).length;
          const cfg = { high: { label: "উচ্চ ঝুঁকি", color: "text-red-700", bg: "bg-red-50 border-red-200" }, medium: { label: "মাঝারি ঝুঁকি", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" }, low: { label: "কম ঝুঁকি", color: "text-green-700", bg: "bg-green-50 border-green-200" } }[s];
          return (
            <div key={s} className={`rounded-xl border p-4 text-center ${cfg.bg}`}>
              <p className={`text-2xl font-bold ${cfg.color}`}>{count}টি</p>
              <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Ranked list */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DCE6E0]">
          <h2 className="font-semibold text-[#17221D]">অগ্রাধিকার তালিকা</h2>
          <p className="text-xs text-[#66736D] mt-0.5">তীব্রতা স্কোর অনুযায়ী র‍্যাংকিং</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE6E0] bg-[#F4FBF6]">
                {["অগ্রাধিকার", "অবস্থান", "আক্রান্ত", "স্কোর", "তীব্রতা", "ত্রাণ"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#66736D] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6E0]">
              {incidentScores.map((inc, i) => {
                const sl = scoreLabel(inc.score);
                const pct = (inc.affectedPeople / maxPeople) * 100;
                return (
                  <tr key={inc.id} className="hover:bg-[#F4FBF6] transition-colors">
                    <td className="px-4 py-3">
                      <span className="size-7 rounded-full bg-[#E8F5E9] text-[#2E7D5B] font-bold text-sm flex items-center justify-center">{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-[#17221D]">{inc.location}</p>
                      <p className="text-xs text-[#66736D]">{inc.disasterType}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-[#17221D]">{inc.affectedPeople.toLocaleString()} জন</p>
                      <div className="w-20 h-1.5 bg-[#F4FBF6] rounded-full overflow-hidden mt-1">
                        <div className="h-full rounded-full bg-[#2E7D5B]" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-lg font-black ${sl.color}`}>{inc.score}</span>
                      <span className="text-xs text-[#66736D]">/100</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sl.bg} ${sl.color}`}>{sl.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/admin/resources" className="text-xs text-[#2E7D5B] font-medium hover:underline">বরাদ্দ →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
