import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiClient, type ChatMessage } from "../../lib/api";

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}

export default function GlobalChat() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [minimized, setMinimized] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const canChat = user?.role === "admin" || user?.role === "volunteer";
  const hiddenRoute = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!canChat) return;

    let active = true;
    let firstLoad = true;
    const loadMessages = async () => {
      try {
        const latest = await apiClient.getChatMessages();
        if (!active) return;
        setMessages(latest);
        setError("");
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "বার্তা লোড করা যায়নি");
      } finally {
        if (active && firstLoad) setLoading(false);
        firstLoad = false;
      }
    };

    setLoading(true);
    void loadMessages();
    const timer = window.setInterval(() => { void loadMessages(); }, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [canChat, user?.id]);

  useEffect(() => {
    if (!minimized && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, minimized]);

  if (!canChat || hiddenRoute) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;

    setSending(true);
    setError("");
    try {
      const created = await apiClient.sendChatMessage(message);
      setMessages((current) => [...current.filter((item) => item.id !== created.id), created].sort((a, b) => a.id - b.id));
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "বার্তা পাঠানো যায়নি");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="fixed bottom-4 right-4 z-[70] w-[min(360px,calc(100vw-2rem))] font-['Noto_Sans_Bengali',sans-serif]">
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex w-full items-center gap-3 rounded-xl border border-[#29453A] bg-[#17221D] px-4 py-3 text-left text-white shadow-[0_8px_30px_#17221d40] transition-colors hover:bg-[#24382F]"
          aria-label="গ্লোবাল চ্যাট খুলুন"
        >
          <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2E7D5B]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h8M8 14h5m-8 6 1.5-3A8 8 0 1 1 18 17l-3 .5-10 2.5Z" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">অ্যাডমিন · স্বেচ্ছাসেবক চ্যাট</span>
            <span className="block text-xs text-white/65">গ্লোবাল সমন্বয় চ্যানেল</span>
          </span>
          <span className="size-2 rounded-full bg-[#8DCEA9]" aria-label="সক্রিয়" />
        </button>
      ) : (
        <div className="flex h-[min(460px,calc(100dvh-2rem))] flex-col overflow-hidden rounded-xl border border-[#DCE6E0] bg-white shadow-[0_12px_40px_#17221d35]">
          <header className="flex flex-shrink-0 items-center gap-3 bg-[#17221D] px-4 py-3 text-white">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#2E7D5B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h8M8 14h5m-8 6 1.5-3A8 8 0 1 1 18 17l-3 .5-10 2.5Z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold">গ্লোবাল চ্যাট</h2>
              <p className="text-[11px] text-white/65">অ্যাডমিন ও স্বেচ্ছাসেবক</p>
            </div>
            <button type="button" onClick={() => setMinimized(true)} className="rounded p-1.5 text-white/75 hover:bg-white/10 hover:text-white" aria-label="চ্যাট ছোট করুন" title="ছোট করুন">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" /></svg>
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F7F9F8] px-3 py-4" aria-live="polite" aria-label="চ্যাট বার্তা">
            {loading && messages.length === 0 && <p className="py-8 text-center text-xs text-[#66736D]">বার্তা লোড হচ্ছে...</p>}
            {!loading && messages.length === 0 && <p className="py-8 text-center text-xs text-[#66736D]">এখনও কোনো বার্তা নেই। সমন্বয়ের জন্য প্রথম বার্তাটি পাঠান।</p>}
            {messages.map((message) => {
              const ownMessage = message.sender_id === user?.id;
              return (
                <article key={message.id} className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-xl px-3 py-2 ${ownMessage ? "rounded-br-sm bg-[#2E7D5B] text-white" : "rounded-bl-sm border border-[#DCE6E0] bg-white text-[#17221D]"}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-[11px] font-semibold ${ownMessage ? "text-white/90" : "text-[#2E7D5B]"}`}>
                        {ownMessage ? "আপনি" : message.sender_name}
                      </span>
                      <span className={`text-[10px] ${ownMessage ? "text-white/60" : "text-[#8A9690]"}`}>
                        {message.sender_role === "admin" ? "প্রশাসক" : "স্বেচ্ছাসেবক"}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.message}</p>
                    <time className={`mt-1 block text-right text-[10px] ${ownMessage ? "text-white/60" : "text-[#8A9690]"}`}>
                      {formatMessageTime(message.created_at)}
                    </time>
                  </div>
                </article>
              );
            })}
          </div>

          {error && <p className="flex-shrink-0 border-t border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-shrink-0 items-end gap-2 border-t border-[#DCE6E0] bg-white p-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={1000}
              rows={1}
              placeholder="বার্তা লিখুন..."
              aria-label="বার্তা লিখুন"
              className="max-h-24 min-h-10 flex-1 resize-y rounded-lg border border-[#DCE6E0] bg-[#F7F9F8] px-3 py-2 text-sm text-[#17221D] outline-none placeholder:text-[#8A9690] focus:border-[#2E7D5B] focus:ring-2 focus:ring-[#2E7D5B]/15"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#2E7D5B] text-white transition-colors hover:bg-[#185C43] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="বার্তা পাঠান"
              title="পাঠান"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m21 3-7.2 18-3.9-7.9L2 9.2 21 3Zm0 0L9.9 13.1" /></svg>
            </button>
          </form>
        </div>
      )}
    </section>
  );
}