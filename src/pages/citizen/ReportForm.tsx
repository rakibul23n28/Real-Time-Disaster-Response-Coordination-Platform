import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ConfirmModal from "../../components/common/ConfirmModal";
import LocationPicker from "../../components/maps/LocationPicker";
import { useAuth } from "../../hooks/useAuth";
import { useCitizenReports } from "../../hooks/useCitizenReports";
import { useToast } from "../../components/common/Toast";

const disasterTypes = ["বন্যা", "ঘূর্ণিঝড়", "নদীভাঙন", "জলাবদ্ধতা", "ভূমিধস", "অন্যান্য"];
const districts = ["সুনামগঞ্জ", "সিলেট", "কক্সবাজার", "খুলনা", "বরিশাল", "চট্টগ্রাম", "রাঙামাটি", "ঢাকা", "ময়মনসিংহ", "রংপুর", "কুমিল্লা", "যশোর"];

const DEMO_LOCATION = { lat: 24.8917, lng: 91.3967 };

export default function ReportForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createReport, uploadPhoto } = useCitizenReports();
  const { showToast } = useToast();

  const [disasterType, setDisasterType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [affectedPeople, setAffectedPeople] = useState("");
  const [district, setDistrict] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState(DEMO_LOCATION);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: number } | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const handleGPS = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationDetected(true);
        setLocationLoading(false);
      },
      () => {
        setCoords(DEMO_LOCATION);
        setLocationDetected(true);
        setLocationLoading(false);
        showToast("ব্রাউজার অবস্থান পাওয়া যায়নি — ডেমো অবস্থান ব্যবহার করা হচ্ছে।", "info");
      }
    );
  };

  const handlePhoto = (files: FileList | null) => {
    if (!files) return;
    setPhotoError("");
    const newPhotos: { file: File; preview: string }[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("ফাইলের আকার ৫ MB-এর বেশি হতে পারবে না।");
        continue;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setPhotoError("শুধুমাত্র JPG, JPEG, PNG ফাইল গ্রহণযোগ্য।");
        continue;
      }
      newPhotos.push({ file, preview: URL.createObjectURL(file) });
    }
    setPhotos((p) => [...p, ...newPhotos].slice(0, 3));
  };

  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!disasterType) e.disasterType = "দুর্যোগের ধরন নির্বাচন করুন।";
    if (!title.trim()) e.title = "ঘটনার শিরোনাম লিখুন।";
    if (!description.trim()) e.description = "ঘটনার বিবরণ লিখুন।";
    if (!locationDetected && !locationName.trim()) e.location = "অবস্থান নির্বাচন করুন।";
    return e;
  };

  const handleSubmitClick = () => {
    const e = validate();
    setTouched({ disasterType: true, title: true, description: true, location: true });
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setShowConfirm(true);
  };

  const clearErrors = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      // Create report on server with all images in one request
      const newReport = await createReport({
        title,
        description,
        disasterType,
        location: {
          name: locationName || "সুনামগঞ্জ, বাংলাদেশ",
          district: district || "সুনামগঞ্জ",
          lat: coords.lat,
          lng: coords.lng,
        },
        affectedPeople: parseInt(affectedPeople) || 0,
        files: photos.map((p) => p.file),
      });

      setShowConfirm(false);
      setSubmitted(newReport);
      showToast("রিপোর্ট সফলভাবে জমা হয়েছে", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "রিপোর্ট জমা দিতে ব্যর্থ হয়েছে";
      showToast(message, "error");
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-[#DCE6E0] p-10 text-center shadow-sm">
          <div className="size-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-[#2E7D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#17221D] mb-1">রিপোর্ট সফলভাবে জমা হয়েছে</h2>
          <p className="text-sm text-[#66736D] mb-5">আপনার রিপোর্ট প্রশাসনিক যাচাইয়ের জন্য পাঠানো হয়েছে।</p>
          <div className="grid grid-cols-2 gap-3 bg-[#F4FBF6] rounded-xl p-4 mb-6 text-sm">
            <div>
              <p className="text-xs text-[#66736D] mb-0.5">রিপোর্ট ID</p>
              <p className="font-bold font-mono text-[#2E7D5B]">{submitted.id}</p>
            </div>
            <div>
              <p className="text-xs text-[#66736D] mb-0.5">অবস্থা</p>
              <p className="font-semibold text-amber-600">অপেক্ষমাণ</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate(`/citizen/reports/${submitted.id}`)} className="flex-1">রিপোর্ট দেখুন</Button>
            <Button onClick={() => navigate("/citizen")} variant="outline" className="flex-1">ড্যাশবোর্ডে ফিরুন</Button>
          </div>
        </div>
      </div>
    );
  }

  const err = (field: string) => touched[field] ? errors[field] : undefined;

  return (
    <div className="max-w-5xl">
      <PageHeader title="দুর্যোগের তথ্য দিন" subtitle="ঘটনার সঠিক তথ্য প্রদান করুন যাতে দ্রুত ব্যবস্থা নেওয়া যায়।" />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form — left */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5 space-y-4">
            <h3 className="font-semibold text-[#17221D] text-sm border-b border-[#DCE6E0] pb-3">দুর্যোগের তথ্য</h3>

            {/* Disaster type */}
            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">
                দুর্যোগের ধরন <span className="text-red-500">*</span>
              </label>
              <select
                value={disasterType}
                onChange={(e) => { setDisasterType(e.target.value); clearErrors("disasterType"); setTouched((p) => ({ ...p, disasterType: true })); }}
                className={`w-full border rounded-[9px] px-3 py-2 text-sm text-[#17221D] bg-white transition-colors focus:outline-none ${err("disasterType") ? "border-red-400 focus:border-red-500" : "border-[#DCE6E0] hover:border-[#b0c4b8] focus:border-[#2E7D5B]"}`}
              >
                <option value="">ধরন নির্বাচন করুন</option>
                {disasterTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              {err("disasterType") && <p className="text-xs text-red-500 mt-1">{err("disasterType")}</p>}
            </div>

            {/* Title */}
            <Input
              label="ঘটনার শিরোনাম"
              placeholder="যেমন: সুনামগঞ্জে হঠাৎ বন্যায় বসতবাড়ি প্লাবিত"
              value={title}
              onChange={(e) => { setTitle(e.target.value); clearErrors("title"); }}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              error={err("title")}
              required
            />

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">
                ঘটনার বিস্তারিত বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                maxLength={500}
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearErrors("description"); }}
                onBlur={() => setTouched((p) => ({ ...p, description: true }))}
                placeholder="ঘটনাটি কীভাবে ঘটেছে, কোন এলাকা আক্রান্ত এবং কী ধরনের সহায়তা প্রয়োজন তা লিখুন।"
                className={`w-full border rounded-[9px] px-3 py-2 text-sm text-[#17221D] bg-white resize-none transition-colors focus:outline-none ${err("description") ? "border-red-400 focus:border-red-500" : "border-[#DCE6E0] hover:border-[#b0c4b8] focus:border-[#2E7D5B]"}`}
              />
              <div className="flex justify-between mt-1">
                {err("description") ? <p className="text-xs text-red-500">{err("description")}</p> : <span />}
                <p className={`text-xs ${description.length > 450 ? "text-amber-500" : "text-[#66736D]"}`}>{description.length} / 500</p>
              </div>
            </div>

            {/* Affected people */}
            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">আক্রান্ত মানুষের আনুমানিক সংখ্যা</label>
              <input
                type="number"
                min="0"
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(e.target.value)}
                placeholder="যেমন: ৩২০"
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm text-[#17221D] bg-white hover:border-[#b0c4b8] focus:border-[#2E7D5B] focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5 space-y-3">
            <h3 className="font-semibold text-[#17221D] text-sm border-b border-[#DCE6E0] pb-3">
              ঘটনার অবস্থান <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { handleGPS(); clearErrors("location"); }}
                disabled={locationLoading}
                className="py-2.5 px-3 text-sm font-medium border-2 border-[#2E7D5B] text-[#2E7D5B] rounded-lg hover:bg-[#E8F5E9] transition-colors flex items-center justify-center gap-2"
              >
                {locationLoading ? (
                  <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> লোড হচ্ছে...</>
                ) : "📍 বর্তমান অবস্থান"}
              </button>
              <button
                type="button"
                onClick={() => { setLocationDetected(true); clearErrors("location"); }}
                className="py-2.5 px-3 text-sm font-medium border border-[#DCE6E0] text-[#66736D] rounded-lg hover:border-[#b0c4b8] transition-colors"
              >
                🗺️ মানচিত্রে নির্বাচন
              </button>
            </div>

            {locationDetected && (
              <div className="p-3 bg-[#E8F5E9] border border-[#b8ddc5] rounded-lg">
                <p className="text-xs font-semibold text-[#2E7D5B] mb-0.5">✓ অবস্থান শনাক্ত হয়েছে</p>
                <p className="text-xs font-mono text-[#66736D]">অক্ষাংশ: {coords.lat.toFixed(5)} · দ্রাঘিমাংশ: {coords.lng.toFixed(5)}</p>
              </div>
            )}

            <Input
              label="নির্দিষ্ট স্থানের নাম"
              placeholder="যেমন: সুনামগঞ্জ সদর উপজেলা"
              value={locationName}
              onChange={(e) => { setLocationName(e.target.value); clearErrors("location"); }}
              onBlur={() => setTouched((p) => ({ ...p, location: true }))}
              error={err("location")}
            />

            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm text-[#17221D] bg-white hover:border-[#b0c4b8] focus:border-[#2E7D5B] focus:outline-none"
              >
                <option value="">জেলা নির্বাচন করুন</option>
                {districts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Photo upload */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5 space-y-3">
            <h3 className="font-semibold text-[#17221D] text-sm border-b border-[#DCE6E0] pb-3">ঘটনার ছবি (ঐচ্ছিক)</h3>
            <p className="text-xs text-[#66736D]">ঘটনার বাস্তব ছবি থাকলে আপলোড করুন। JPG, PNG — সর্বোচ্চ ৫ MB</p>

            {photos.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative size-20 rounded-lg overflow-hidden border border-[#DCE6E0] group">
                    <img src={p.preview} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs"
                    >
                      মুছুন
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => handlePhoto(e.target.files)} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-[#DCE6E0] rounded-xl p-5 text-center hover:border-[#2E7D5B] transition-colors"
            >
              <p className="text-2xl mb-1">📷</p>
              <p className="text-sm text-[#66736D]">ছবি টেনে আনুন বা ক্লিক করুন</p>
            </button>
            {photoError && <p className="text-xs text-red-500">{photoError}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSubmitClick} className="flex-1">রিপোর্ট জমা দিন</Button>
            <Button onClick={() => navigate("/citizen")} variant="outline">বাতিল করুন</Button>
          </div>
        </div>

        {/* Map preview — right */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-4 sticky top-4">
            <h3 className="font-semibold text-[#17221D] text-sm mb-3">মানচিত্রে অবস্থান নির্বাচন করুন</h3>
            <LocationPicker 
              value={coords} 
              onChange={(newCoords) => { 
                setCoords(newCoords); 
                setLocationDetected(true); 
                clearErrors("location");
              }} 
              height="300px" 
            />
            <div className="mt-3 p-3 bg-[#F4FBF6] rounded-lg text-xs text-[#66736D] font-mono">
              <p>অক্ষাংশ: {coords.lat.toFixed(5)}</p>
              <p>দ্রাঘিমাংশ: {coords.lng.toFixed(5)}</p>
            </div>
            <p className="text-xs text-[#66736D] mt-2">মানচিত্রে ক্লিক করুন বা মার্কার টেনে অবস্থান নির্বাচন করুন।</p>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="রিপোর্ট জমা দেবেন?"
        message="আপনার দেওয়া তথ্য প্রশাসনিক যাচাইয়ের জন্য পাঠানো হবে।"
        confirmLabel="হ্যাঁ, জমা দিন"
        cancelLabel="ফিরে যান"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={submitting}
      />
    </div>
  );
}
