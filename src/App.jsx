import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const AUTO_RESET_HOUR = 5; // new day starts at 5 AM

const groups = [
  {
    id: "open", emoji: "🚪", color: "#0ea5e9",
    title: { ar: "فتح المحل والإضاءة", en: "Opening & Lights", bn: "দোকান খোলা ও লাইট" },
    tasks: [
      { ar: "فتح الباب الأمامي للمحل", en: "Open the front door of the shop", bn: "দোকানের সামনের দরজা খোলো" },
      { ar: "تشغيل جميع لمبات السقف والتأكد أنها تعمل", en: "Turn on all ceiling lights, check all work", bn: "সিলিং এর সব লাইট জ্বালাও — সব কাজ করছে দেখো" },
      { ar: "تشغيل جميع لمبات تحت البار والتأكد أنها تعمل", en: "Turn on all under-bar lights, check all work", bn: "বারের নিচের সব লাইট জ্বালাও — সব কাজ করছে দেখো" },
      { ar: "إذا في لمبة لا تعمل، أبلغ المدير على الواتس", en: "If any light not working, WhatsApp the manager", bn: "কোনো লাইট কাজ না করলে ম্যানেজারকে হোয়াটসঅ্যাপে জানাও" },
    ],
  },
  {
    id: "brew", emoji: "☕", color: "#b45309",
    title: { ar: "تحضير المشروبات الصباحية", en: "Morning Drinks Prep", bn: "সকালের পানীয় তৈরি" },
    tasks: [
      { ar: "تجهيز الشاي وكتابة الساعة على الورقة", en: "Brew tea and write the time on the paper", bn: "চা বানাও — কাগজে কয়টায় বানিয়েছো লিখো" },
      { ar: "قياس درجة حرارة الشاي وتسجيلها في الورقة", en: "Measure tea temperature and write it on paper", bn: "চায়ের তাপমাত্রা মাপো এবং কাগজে লিখো" },
      { ar: "إعادة قياس درجة حرارة الشاي كل ساعة وتسجيلها", en: "Re-check tea temperature every hour and record", bn: "প্রতি ঘণ্টায় তাপমাত্রা মাপো এবং লিখো" },
      { ar: "تشغيل الفرن والغاز على درجة منخفضة", en: "Turn on oven and gas on low heat", bn: "চুলা ও গ্যাস কম আঁচে জ্বালাও" },
      { ar: "تجهيز الموية الحارة للكرك", en: "Prepare hot water for karak", bn: "করাকের জন্য গরম পানি প্রস্তুত করো" },
      { ar: "تحضير الكرك مع أول طلب يأتي في الصباح", en: "Make karak with the first morning order", bn: "সকালের প্রথম অর্ডার আসলে করাক বানাও" },
      { ar: "وضع الفوم أمام البار", en: "Place the foam in front of the bar", bn: "বারের সামনে ফোম রাখো" },
    ],
  },
  {
    id: "tech", emoji: "📱", color: "#7c3aed",
    title: { ar: "الأجهزة والإنترنت", en: "Devices & Internet", bn: "ইন্টারনেট ও মেশিন" },
    tasks: [
      { ar: "التحقق من أن الإنترنت يعمل بشكل ممتاز", en: "Check internet works perfectly", bn: "ইন্টারনেট ভালোভাবে কাজ করছে কিনা দেখো" },
      { ar: "تشغيل الكاشير والتأكد أنه جاهز", en: "Turn on cashier, verify it's ready", bn: "ক্যাশিয়ার চালু করো — প্রস্তুত কিনা দেখো" },
      { ar: "التحقق من جهاز كيتا وجهاز هنقرستيشن", en: "Check Keeta and HungerStation devices", bn: "Keeta ও HungerStation মেশিন চেক করো" },
      { ar: "إذا في أي خلل، التواصل مع المدير مباشرة", en: "If any problem, contact manager directly", bn: "কোনো সমস্যা হলে সরাসরি ম্যানেজারকে ফোন করো" },
    ],
  },
  {
    id: "clean", emoji: "🪑", color: "#4b5563",
    title: { ar: "نظافة المكان وتجهيز الجلسات", en: "Cleaning & Seating Setup", bn: "পরিষ্কার ও বসার জায়গা প্রস্তুত" },
    tasks: [
      { ar: "التحقق من نظافة المكان بشكل كامل", en: "Verify the place is fully clean", bn: "পুরো জায়গা পরিষ্কার আছে কিনা দেখো" },
      { ar: "تنظيف الطاولات والكراسي وترتيبها", en: "Clean tables and chairs, arrange them", bn: "টেবিল ও চেয়ার মুছো এবং সাজাও" },
      { ar: "تنظيف الزجاج وترتيب المخدات", en: "Clean the glass and arrange the cushions", bn: "কাচ পরিষ্কার করো ও কুশন সাজাও" },
      { ar: "التأكد أن المكان مهيأ ومريح لاستقبال الزبائن", en: "Verify place is ready and comfortable for guests", bn: "অতিথিদের জন্য জায়গা প্রস্তুত ও আরামদায়ক কিনা দেখো" },
      { ar: "التأكد أن رائحة المحل ممتازة وتعطيره", en: "Check the smell is good and freshen the place", bn: "দোকানের গন্ধ ভালো কিনা দেখো ও সুগন্ধি দাও" },
      { ar: "تشغيل الموسيقى بصوت خافت", en: "Turn on music at low volume", bn: "মিউজিক চালু করো — আস্তে আওয়াজে" },
    ],
  },
  {
    id: "bar", emoji: "🍯", color: "#c2410c",
    title: { ar: "البار", en: "Bar", bn: "বার" },
    tasks: [
      { ar: "التحقق من أن كل المواد عليها تاريخ صلاحية", en: "Check all items have an expiry date", bn: "সব জিনিসে মেয়াদের তারিখ আছে কিনা দেখো" },
      { ar: "التحقق من أن كل شيء في مكانه المناسب", en: "Check everything is in its proper place", bn: "সবকিছু ঠিক জায়গায় আছে কিনা দেখো" },
      { ar: "التحقق من نظافة البار وتنظيفه بشكل كامل", en: "Check bar cleanliness and clean it completely", bn: "বার পরিষ্কার আছে কিনা দেখো এবং পুরোপুরি পরিষ্কার করো" },
    ],
  },
  {
    id: "kitchen", emoji: "👨‍🍳", color: "#d97706",
    title: { ar: "المطبخ", en: "Kitchen", bn: "রান্নাঘর" },
    tasks: [
      { ar: "التحقق من نظافة المطبخ وتنظيفه بشكل جيد", en: "Verify kitchen cleanliness and clean it well", bn: "রান্নাঘর পরিষ্কার আছে কিনা দেখো ও ভালো করে পরিষ্কার করো" },
      { ar: "ترتيب المطبخ وأدواته في أماكنها", en: "Arrange kitchen and tools in their places", bn: "রান্নাঘর ও জিনিসপত্র ঠিক জায়গায় সাজাও" },
    ],
  },
  {
    id: "equip", emoji: "🔧", color: "#0891b2",
    title: { ar: "فحص المعدات", en: "Equipment Check", bn: "মেশিন চেক" },
    tasks: [
      { ar: "التحقق من أن جميع معدات المطبخ تعمل", en: "Check all kitchen equipment works", bn: "রান্নাঘরের সব মেশিন কাজ করছে কিনা দেখো" },
      { ar: "التحقق من أن جميع الثلاجات تبرّد بشكل صحيح", en: "Check all fridges are cooling properly", bn: "সব ফ্রিজ ঠিকভাবে ঠান্ডা করছে কিনা দেখো" },
      { ar: "التحقق من أن الفريزر يفرّز بشكل صحيح", en: "Check the freezer is freezing properly", bn: "ফ্রিজার ঠিকভাবে বরফ করছে কিনা দেখো" },
      { ar: "التحقق من أن الآيس ميكر يصنع الثلج", en: "Check the ice maker is making ice", bn: "আইস মেকার বরফ বানাচ্ছে কিনা দেখো" },
      { ar: "التحقق من أن آلة خبز المسح تعمل بدون مشاكل", en: "Check the flat bread machine has no problems", bn: "রুটির মেশিন ঠিকমতো কাজ করছে কিনা দেখো" },
      { ar: "التحقق من أن المغسلة تعمل بشكل جيد", en: "Check the dishwasher/sink is working properly", bn: "সিঙ্ক ভালো কাজ করছে কিনা দেখো" },
      { ar: "إذا في أي عطل، أبلغ المدير فوراً", en: "If any problem, tell manager immediately", bn: "কোনো সমস্যা হলে সাথে সাথে ম্যানেজারকে জানাও" },
    ],
  },
  {
    id: "fridge", emoji: "❄️", color: "#0369a1",
    title: { ar: "فحص الثلاجات وتواريخ الصلاحية", en: "Fridge & Expiry Check", bn: "ফ্রিজ ও মেয়াদ চেক" },
    tasks: [
      { ar: "فتح الثلاجة والتأكد أن كل شيء عليه تاريخ انتهاء واضح", en: "Open fridge — verify every item has a clear expiry date", bn: "ফ্রিজ খোলো — প্রতিটি জিনিসে স্পষ্ট মেয়াদের তারিখ আছে কিনা দেখো" },
      { ar: "التأكد من تواريخ المواد خارج الثلاجة وعلى البار", en: "Check dates of items outside fridge and on the bar", bn: "ফ্রিজের বাইরে এবং বারের জিনিসেরও মেয়াদ চেক করো" },
      { ar: "تغيير أي مادة تاريخها قديم أو منتهي", en: "Replace any item with old or expired date", bn: "মেয়াদ পুরোনো বা শেষ এমন জিনিস বদলাও" },
    ],
  },
  {
    id: "timing", emoji: "⏰", color: "#dc2626",
    title: { ar: "مهام الساعة 10 صباحاً", en: "10 AM Tasks", bn: "সকাল ১০টার কাজ" },
    tasks: [
      { ar: "الساعة 10:00: إخراج الخلية والمعجنات من الفريزر إلى الثلاجة", en: "At 10 AM: move honeycomb & pastries from freezer to fridge", bn: "সকাল ১০টায়: মৌচাক ও পেস্ট্রি ফ্রিজার থেকে ফ্রিজে রাখো" },
      { ar: "التأكد أن الكمية كافية لنهاية اليوم", en: "Verify quantity is enough for end of day", bn: "দিনের শেষ পর্যন্ত যথেষ্ট পরিমাণ আছে কিনা দেখো" },
      { ar: "عدم ترك الخلية أو المعجنات أو الصوصات خارج الثلاجة", en: "Never leave honeycomb, pastries or sauces outside fridge", bn: "মৌচাক, পেস্ট্রি বা সস ফ্রিজের বাইরে কখনো রাখবে না" },
      { ar: "عند الطلب: إخراج المنتج، تجهيزه، وإرجاع الباقي للثلاجة فوراً", en: "On order: take out, prepare, return rest to fridge at once", bn: "অর্ডার আসলে: বের করো, প্রস্তুত করো, বাকিটা সাথে সাথে ফ্রিজে রাখো" },
    ],
  },
  {
    id: "delivery", emoji: "📦", color: "#65a30d",
    title: { ar: "استلام طلب المستودع", en: "Warehouse Delivery", bn: "গুদাম থেকে মাল গ্রহণ" },
    tasks: [
      { ar: "عد كل صنف من الدلفري بدقة عند الوصول", en: "Count every delivery item accurately on arrival", bn: "মাল আসার সাথে সাথে প্রতিটি জিনিস সঠিকভাবে গণনা করো" },
      { ar: "التأكد أن المستودع لم يخطئ في الأرقام أو الكميات", en: "Verify warehouse made no errors in numbers or quantities", bn: "গুদাম সংখ্যায় ভুল করেছে কিনা যাচাই করো" },
      { ar: "تسجيل جميع الكميات المستلمة في الجوال", en: "Record all received quantities on the phone", bn: "মোবাইলে সব পাওয়া পরিমাণ লিখে রাখো" },
      { ar: "إذا في نقص أو خطأ، أبلغ المدير فوراً", en: "If any shortage or error, tell manager immediately", bn: "ঘাটতি বা ভুল থাকলে সাথে সাথে ম্যানেজারকে জানাও" },
    ],
  },
  {
    id: "stock", emoji: "📊", color: "#059669",
    title: { ar: "فحص المخزون بعد الاستلام", en: "Stock Check After Delivery", bn: "মাল গ্রহণের পর স্টক চেক" },
    tasks: [
      { ar: "فحص البار والتأكد أن كل شيء يكفي لليوم", en: "Check the bar — verify everything is enough for the day", bn: "বার চেক করো — দিনের জন্য সব যথেষ্ট কিনা দেখো" },
      { ar: "فحص المطبخ والتأكد أن كل شيء يكفي لليوم", en: "Check the kitchen — verify everything is enough for the day", bn: "রান্নাঘর চেক করো — দিনের জন্য সব যথেষ্ট কিনা দেখো" },
      { ar: "إرسال قائمة بالنواقص للمدير على الواتس فوراً", en: "Send list of shortages to manager on WhatsApp immediately", bn: "যা যা কম আছে তা সাথে সাথে ম্যানেজারকে হোয়াটসঅ্যাপে পাঠাও" },
    ],
  },
];

const todayKey = () => {
  const d = new Date();
  if (d.getHours() < AUTO_RESET_HOUR) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function App() {
  const [view, setView] = useState("staff");
  const [staffChecked, setStaffChecked] = useState({});
  const [managerStatus, setManagerStatus] = useState({});
  const [expanded, setExpanded] = useState({});
  const [expandedMgr, setExpandedMgr] = useState({});
  const [syncStatus, setSyncStatus] = useState("loading");
  const [lastSync, setLastSync] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const dayId = todayKey();
  const saveTimer = useRef(null);

  // ── Load today's row from Supabase ──
  const load = async () => {
    try {
      const { data, error } = await supabase
        .from("checklists")
        .select("staff_checked, manager_status")
        .eq("day_id", dayId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setStaffChecked(data.staff_checked || {});
        setManagerStatus(data.manager_status || {});
      } else {
        // create today's empty row
        await supabase.from("checklists").insert({ day_id: dayId, staff_checked: {}, manager_status: {} });
        setStaffChecked({});
        setManagerStatus({});
      }
      setLastSync(new Date());
      setSyncStatus("synced");
    } catch (e) {
      setSyncStatus("error");
    }
  };

  // ── Save (debounced) ──
  const save = (sc, ms) => {
    setSyncStatus("syncing");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("checklists")
          .upsert({ day_id: dayId, staff_checked: sc, manager_status: ms }, { onConflict: "day_id" });
        if (error) throw error;
        setLastSync(new Date());
        setSyncStatus("synced");
      } catch {
        setSyncStatus("error");
      }
    }, 400);
  };

  useEffect(() => {
    load();
    // Realtime subscription — updates from other phones appear instantly
    const channel = supabase
      .channel("checklist-changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "checklists", filter: `day_id=eq.${dayId}` },
        (payload) => {
          if (payload.new) {
            setStaffChecked(payload.new.staff_checked || {});
            setManagerStatus(payload.new.manager_status || {});
            setLastSync(new Date());
            setSyncStatus("synced");
          }
        })
      .subscribe();

    // light safety poll every 15s in case realtime drops
    const iv = setInterval(load, 15000);
    return () => { supabase.removeChannel(channel); clearInterval(iv); };
  }, [dayId]);

  const addToast = (msg, color) => {
    const id = ++toastId.current;
    setToasts((p) => [...p, { id, msg, color }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  const toggleStaff = (gid, ti) => {
    const key = `${gid}-${ti}`;
    setStaffChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const grp = groups.find((g) => g.id === gid);
      const allDone = grp.tasks.every((_, i) => next[`${gid}-${i}`]);
      if (allDone && !grp.tasks.every((_, i) => prev[`${gid}-${i}`])) addToast(`✅ ${grp.title.ar}`, grp.color);
      save(next, managerStatus);
      return next;
    });
  };

  const setMgr = (gid, ti, status) => {
    const key = `${gid}-${ti}`;
    setManagerStatus((prev) => { const next = { ...prev, [key]: status }; save(staffChecked, next); return next; });
  };

  const resetAll = async () => {
    if (!window.confirm("هل تريد إعادة تعيين كل المهام؟\nReset all tasks?")) return;
    setStaffChecked({}); setManagerStatus({}); setToasts([]);
    save({}, {});
  };

  const allKeys = groups.flatMap((g) => g.tasks.map((_, i) => `${g.id}-${i}`));
  const totalDone = allKeys.filter((k) => staffChecked[k]).length;
  const totalPct = allKeys.length ? Math.round((totalDone / allKeys.length) * 100) : 0;
  const totalPass = allKeys.filter((k) => managerStatus[k] === "pass").length;
  const totalFail = allKeys.filter((k) => managerStatus[k] === "fail").length;

  const today = new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const statusDot = { synced: "🟢", syncing: "🟡", loading: "⏳", error: "🔴" }[syncStatus];

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#faf5ef", color: "#1a0a00", paddingBottom: 90 }}>
      <div style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 9999, width: "90%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ background: "#fff", border: `2px solid ${t.color}`, borderRadius: 14, padding: "10px 14px", boxShadow: "0 8px 28px rgba(0,0,0,0.15)", animation: "slideIn 0.3s ease", fontSize: 13, fontWeight: 700, color: t.color }}>{t.msg}</div>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ background: "linear-gradient(135deg, #6b1600 0%, #b83000 55%, #e05000 100%)", padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
              <span style={{ fontSize: 22 }}>🌅</span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600 }}>TEAYA — فرع المبرز</span>
            </div>
            <h1 style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: "0 0 2px" }}>تشيك ليست شفت الصباح</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, margin: 0 }}>Morning Shift · {today}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "6px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: totalPct === 100 ? "#4ade80" : "#fff" }}>{totalPct}%</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{totalDone}/{allKeys.length}</div>
            <div style={{ fontSize: 9, color: "#fff", marginTop: 2 }}>{statusDot} {lastSync ? lastSync.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }) : "--"}</div>
          </div>
        </div>
        <div style={{ marginTop: 8, height: 5, background: "rgba(255,255,255,0.2)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${totalPct}%`, background: totalPct === 100 ? "#4ade80" : "#fff", borderRadius: 10, transition: "width 0.4s" }} />
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "2px solid #f0e4d4", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {[{ k: "staff", label: "📋 الموظف / Staff" }, { k: "manager", label: "📊 المدير / Manager" }].map((v) => (
          <button key={v.k} onClick={() => setView(v.k)} style={{ flex: 1, padding: "10px 6px", border: "none", background: "transparent", cursor: "pointer", borderBottom: view === v.k ? "3px solid #b83000" : "3px solid transparent" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: view === v.k ? "#b83000" : "#bbb" }}>{v.label}</div>
          </button>
        ))}
      </div>

      {view === "manager" && (
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, background: "#dcfce7", borderRadius: 12, padding: "10px 12px", textAlign: "center", border: "1.5px solid #16a34a" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#16a34a" }}>{totalPass}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#16a34a" }}>✅ Pass</div>
            </div>
            <div style={{ flex: 1, background: "#fee2e2", borderRadius: 12, padding: "10px 12px", textAlign: "center", border: "1.5px solid #dc2626" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#dc2626" }}>{totalFail}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626" }}>❌ Fail</div>
            </div>
            <div style={{ flex: 1, background: "#f5ece0", borderRadius: 12, padding: "10px 12px", textAlign: "center", border: "1.5px solid #d97706" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#d97706" }}>{allKeys.length - totalPass - totalFail}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#d97706" }}>⏳ Pending</div>
            </div>
          </div>

          {groups.map((g) => {
            const keys = g.tasks.map((_, i) => `${g.id}-${i}`);
            const sPass = keys.filter((k) => managerStatus[k] === "pass").length;
            const sFail = keys.filter((k) => managerStatus[k] === "fail").length;
            const isOpen = expandedMgr[g.id];
            return (
              <div key={g.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden", border: `1.5px solid ${g.color}30` }}>
                <div onClick={() => setExpandedMgr((p) => ({ ...p, [g.id]: !isOpen }))} style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: `${g.color}08` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${g.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: `2px solid ${g.color}35` }}>{g.emoji}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{g.title.ar}</div>
                      <div style={{ fontSize: 9, color: "#aaa" }}>{g.title.en}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 7px", borderRadius: 20 }}>✅ {sPass}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "2px 7px", borderRadius: 20 }}>❌ {sFail}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "2px 7px", borderRadius: 20 }}>⏳ {keys.length - sPass - sFail}</span>
                    <span style={{ color: "#ccc", fontSize: 12, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "0.2s" }}>▶</span>
                  </div>
                </div>
                {isOpen && g.tasks.map((task, ti) => {
                  const key = `${g.id}-${ti}`;
                  const sStatus = managerStatus[key];
                  const isChecked = staffChecked[key];
                  return (
                    <div key={ti} style={{ padding: "10px 14px", borderTop: "1px solid #f5ece0", background: sStatus === "pass" ? "#f0fdf4" : sStatus === "fail" ? "#fef2f2" : "#fff" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, marginTop: 2, background: isChecked ? "#16a34a" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isChecked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#1a0a00", lineHeight: 1.5, marginBottom: 2 }}>{task.ar}</div>
                          <div style={{ fontSize: 10, color: "#888", direction: "ltr", textAlign: "left" }}>{task.en}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button onClick={() => setMgr(g.id, ti, sStatus === "pass" ? null : "pass")} style={{ padding: "5px 16px", borderRadius: 20, border: `2px solid ${sStatus === "pass" ? "#16a34a" : "#d1d5db"}`, background: sStatus === "pass" ? "#16a34a" : "transparent", color: sStatus === "pass" ? "#fff" : "#6b7280", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>✅ Pass</button>
                        <button onClick={() => setMgr(g.id, ti, sStatus === "fail" ? null : "fail")} style={{ padding: "5px 16px", borderRadius: 20, border: `2px solid ${sStatus === "fail" ? "#dc2626" : "#d1d5db"}`, background: sStatus === "fail" ? "#dc2626" : "transparent", color: sStatus === "fail" ? "#fff" : "#6b7280", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>❌ Fail</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {view === "staff" && (
        <div style={{ padding: "8px 0 0" }}>
          {groups.map((g) => {
            const keys = g.tasks.map((_, i) => `${g.id}-${i}`);
            const done = keys.filter((k) => staffChecked[k]).length;
            const allDone = done === keys.length;
            const isOpen = expanded[g.id] !== false;
            return (
              <div key={g.id} style={{ marginBottom: 6 }}>
                <div onClick={() => setExpanded((p) => ({ ...p, [g.id]: !isOpen }))} style={{ background: allDone ? `${g.color}10` : "#fff", padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderRight: `4px solid ${allDone ? g.color : "#e0d0c0"}`, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{g.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: g.color }}>{g.title.ar}</div>
                      <div style={{ fontSize: 10, color: "#aaa", direction: "ltr" }}>{g.title.en}</div>
                      <div style={{ fontSize: 10, color: "#bbb", direction: "ltr" }}>{g.title.bn}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: allDone ? "#fff" : g.color, background: allDone ? g.color : `${g.color}18`, padding: "3px 10px", borderRadius: 20 }}>{allDone ? "✓ تم" : `${done}/${keys.length}`}</span>
                    <span style={{ color: "#ccc", fontSize: 12, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "0.2s" }}>▶</span>
                  </div>
                </div>

                {isOpen && g.tasks.map((task, ti) => {
                  const key = `${g.id}-${ti}`;
                  const checked = !!staffChecked[key];
                  const mStatus = managerStatus[key];
                  return (
                    <div key={ti} onClick={() => toggleStaff(g.id, ti)} style={{ display: "flex", gap: 11, padding: "11px 14px", background: checked ? "#fdf8f4" : "#fff", borderBottom: "1px solid #f5ece0", borderRight: `2px solid ${checked ? g.color : "#f5ece0"}`, cursor: "pointer" }}>
                      <div style={{ width: 22, height: 22, minWidth: 22, borderRadius: 6, marginTop: 2, border: checked ? "none" : `2px solid ${g.color}50`, background: checked ? g.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        {checked && <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: checked ? "#bbb" : "#1a0a00", textDecoration: checked ? "line-through" : "none", lineHeight: 1.5, marginBottom: 3 }}>{task.ar}</div>
                        <div style={{ fontSize: 11, color: checked ? "#ccc" : "#777", textDecoration: checked ? "line-through" : "none", direction: "ltr", textAlign: "left", lineHeight: 1.4, marginBottom: 1 }}>{task.en}</div>
                        <div style={{ fontSize: 11, color: checked ? "#ddd" : "#aaa", textDecoration: checked ? "line-through" : "none", direction: "ltr", textAlign: "left", lineHeight: 1.4 }}>{task.bn}</div>
                        {mStatus && (
                          <div style={{ marginTop: 5 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: mStatus === "pass" ? "#16a34a" : "#dc2626", background: mStatus === "pass" ? "#dcfce7" : "#fee2e2", padding: "2px 8px", borderRadius: 20, border: `1px solid ${mStatus === "pass" ? "#16a34a" : "#dc2626"}` }}>
                              {mStatus === "pass" ? "✅ Manager: Pass" : "❌ Manager: Fail"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: "#fff", borderTop: "1px solid #f0e4d4", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
        <button onClick={resetAll} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 12, fontWeight: 800, background: "linear-gradient(135deg,#6b1600,#b83000)", color: "#fff" }}>
          🔄 إعادة تعيين الكل — Reset All
        </button>
      </div>
    </div>
  );
}
