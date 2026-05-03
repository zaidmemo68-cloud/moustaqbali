import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, CheckCircle2, Globe, MapPin, BrainCircuit, Loader2, Sparkles, Download, Zap, FileUp, Plus, X } from "lucide-react";
import { useCreateUser, useUpdateUser, useUser, useRecommend } from "@/hooks/use-users";
import { cn } from "@/lib/utils";

const WILAYAS = ["أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تيموشنت", "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس", "عين صالح", "عين قزام", "توقرت", "جانت", "المغير", "المنيعة"];

const TECHNICAL_SKILLS = ["JavaScript", "Python", "Java", "C++", "PHP", "SQL", "React", "Node.js", "Angular", "Django", "Laravel", "Docker", "AWS", "Git"];
const SOFT_SKILLS = ["التواصل", "القيادة", "التعاون", "حل المشاكل", "الإبداع", "إدارة الوقت", "التفاوض"];

export function Wizard() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);

  const { data: user } = useUser(userId);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const handleNext = () => setStep((s) => Math.min(s + 1, 10));

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 10 + 10}s`,
    delay: `${Math.random() * 5}s`,
  }));

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Welcome onNext={handleNext} onSubmit={createMutation.mutateAsync} setUserId={setUserId} />;
      case 2: return <Step2Profile onNext={handleNext} userId={userId} update={updateMutation.mutateAsync} user={user} />;
      case 3: return <Step3Plan onNext={handleNext} userId={userId} update={updateMutation.mutateAsync} user={user} />;
      case 4: return <Step4Quiz onNext={handleNext} userId={userId} update={updateMutation.mutateAsync} user={user} />;
      case 5: return <Step5Jobs onNext={handleNext} userId={userId} update={updateMutation.mutateAsync} user={user} />;
      case 6: return <Step6Learning onNext={handleNext} user={user} />;
      case 7: return <Step7Test onNext={handleNext} userId={userId} user={user} update={updateMutation.mutateAsync} />;
      case 8: return <Step8Certificate onNext={handleNext} user={user} />;
      case 9: return <Step9Companies onNext={handleNext} />;
      case 10: return <Step10Result user={user} onRestart={() => { setStep(1); setUserId(null); }} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="particles-container">
        {particles.map((p) => (
          <div key={p.id} className="particle" style={{ width: p.size, height: p.size, top: p.top, left: p.left, "--duration": p.duration, animationDelay: p.delay } as any} />
        ))}
      </div>

      <div className="max-w-md w-full mx-auto mb-8 text-center relative z-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative inline-flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-[#0a1628] flex items-center justify-center shadow-[0_10px_30px_rgba(10,22,40,0.2)]">
            <span className="text-5xl font-bold text-[#0a1628] font-display">م</span>
          </div>
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-[#0a1628]">مستقبلي</h1>
        <p className="text-[#0a1628]/80 text-lg font-medium">خريطتك المهنية نحو دخل حقيقي | YOUR CAREER GPS</p>
      </div>

      {step > 1 && step <= 9 && (
        <div className="max-w-md w-full mx-auto mb-8 relative z-10">
          <div className="flex justify-between text-sm text-[#0a1628]/60 font-bold mb-2 px-1">
            <span>الخطوة {step - 1} من 9</span>
            <span>{Math.round(((step - 1) / 9) * 100)}%</span>
          </div>
          <div className="h-3 w-full bg-[#0a1628]/10 rounded-full overflow-hidden border border-[#0a1628]/5">
            <motion.div className="h-full bg-[#0a1628] rounded-full" initial={{ width: 0 }} animate={{ width: `${((step - 1) / 9) * 100}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>
      )}

      <div className="flex-1 w-full max-w-md mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }, exit: { opacity: 0, y: -30, transition: { duration: 0.4 } } }} initial="hidden" animate="visible" exit="exit" className="glass-card rounded-[2.5rem] p-8 sm:p-10">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const step1Schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  age: z.coerce.number().min(18, "يجب أن تكون 18 على الأقل"),
  status: z.string().min(1, "الرجاء اختيار وضعك الحالي"),
});

function Step1Welcome({ onNext, onSubmit, setUserId }: any) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(step1Schema) });
  const doSubmit = async (data: any) => {
    try {
      const user = await onSubmit(data);
      setUserId(user.id);
      onNext();
    } catch (err) { console.error(err); }
  };
  return (
    <div>
      <div className="text-center mb-8"><h2 className="text-3xl font-extrabold text-[#0a1628] mb-4">أهلاً بك في مستقبلك</h2><p className="text-lg italic text-[#0a1628]/70 font-display leading-relaxed">"إن الطريق إلى النجاح يبدأ بخطوة واضحة، ونحن هنا لنرسم لك الخريطة."</p></div>
      <form onSubmit={handleSubmit(doSubmit)} className="space-y-5">
        <input {...register("name")} placeholder="الاسم الكامل" className="glass-input" />
        {errors.name && <p className="text-red-500 text-sm font-bold">{errors.name.message}</p>}
        <input type="email" {...register("email")} placeholder="البريد الإلكتروني" className="glass-input text-left" dir="ltr" />
        {errors.email && <p className="text-red-500 text-sm font-bold">{errors.email.message}</p>}
        <div className="grid grid-cols-2 gap-4">
          <input type="number" {...register("age")} placeholder="العمر" className="glass-input" />
          <select {...register("status")} className="glass-input">
            <option value="">الوضع الحالي</option>
            <option value="student">طالب</option>
            <option value="graduate">خريج</option>
            <option value="career-change">تغيير مهنة</option>
            <option value="entrepreneur">رائد أعمال</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} className="shimmer-button w-full text-xl">
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "🎯 ابدأ رحلتك"}
        </button>
      </form>
    </div>
  );
}

function Step2Profile({ onNext, userId, update, user }: any) {
  const [profile, setProfile] = useState({
    wilaya: user?.wilaya || "",
    degreeLevel: user?.degreeLevel || "",
    fieldOfStudy: user?.fieldOfStudy || "",
    institution: user?.institution || "",
    graduationYear: user?.graduationYear?.toString() || "",
    yearsOfExperience: user?.yearsOfExperience || "0",
    previousJobTitle: user?.previousJobTitle || "",
    mainAchievements: user?.mainAchievements || "",
    languages: user?.languages || [],
    technicalSkills: user?.technicalSkills || [],
    softSkills: user?.softSkills || [],
    githubLink: user?.githubLink || "",
    linkedinLink: user?.linkedinLink || "",
    certificates: user?.professionalCertificates || [],
  });

  const [newCert, setNewCert] = useState({ name: "", organization: "", year: "" });
  const [isLoading, setIsLoading] = useState(false);

  const completion = Math.round(
    ((profile.wilaya ? 1 : 0) +
    (profile.degreeLevel ? 1 : 0) +
    (profile.fieldOfStudy ? 1 : 0) +
    (profile.institution ? 1 : 0) +
    (profile.yearsOfExperience ? 1 : 0) +
    (profile.previousJobTitle ? 1 : 0) +
    (profile.languages.length > 0 ? 1 : 0) +
    (profile.technicalSkills.length > 0 ? 1 : 0) +
    (profile.mainAchievements ? 1 : 0) +
    (profile.githubLink || profile.linkedinLink ? 1 : 0)) / 10 * 100
  );

  const handleLanguageToggle = (lang: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleSkillToggle = (skill: string, type: 'technical' | 'soft') => {
    const key = type === 'technical' ? 'technicalSkills' : 'softSkills';
    setProfile(prev => ({
      ...prev,
      [key]: prev[key].includes(skill)
        ? prev[key].filter(s => s !== skill)
        : [...prev[key], skill]
    }));
  };

  const handleAddCert = () => {
    if (newCert.name && newCert.organization) {
      setProfile(prev => ({
        ...prev,
        certificates: [...prev.certificates, newCert]
      }));
      setNewCert({ name: "", organization: "", year: "" });
    }
  };

  const handleRemoveCert = (idx: number) => {
    setProfile(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== idx)
    }));
  };

  const handleContinue = async () => {
    setIsLoading(true);
    await update({ 
      id: userId, 
      ...profile, 
      professionalCertificates: profile.certificates,
      currentStep: 2 
    });
    setIsLoading(false);
    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-sm font-bold text-[#0a1628] mb-2">
          <span>اكتمال الملف الشخصي</span>
          <span>{Math.round(completion)}%</span>
        </div>
        <div className="h-3 bg-[#0a1628]/10 rounded-full overflow-hidden border-2 border-[#0a1628]">
          <motion.div className="h-full bg-gradient-to-r from-[#0a1628] to-[#C9A84C]" initial={{ width: 0 }} animate={{ width: `${completion}%` }} />
        </div>
      </div>

      <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
        <div>
          <label className="block font-bold text-[#0a1628] mb-2">الولاية (المقاطعة)</label>
          <select value={profile.wilaya} onChange={(e) => setProfile({...profile, wilaya: e.target.value})} className="glass-input">
            <option value="">اختر ولايتك</option>
            {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-4">التعليم</h3>
          <select value={profile.degreeLevel} onChange={(e) => setProfile({...profile, degreeLevel: e.target.value})} className="glass-input mb-3">
            <option value="">مستوى التعليم</option>
            <option value="no-degree">بدون شهادة</option>
            <option value="bac">بكالوريا</option>
            <option value="license">ليسانس</option>
            <option value="masters">ماستر</option>
            <option value="phd">دكتوراه</option>
            <option value="engineer">مهندس دولة</option>
          </select>
          <input value={profile.fieldOfStudy} onChange={(e) => setProfile({...profile, fieldOfStudy: e.target.value})} placeholder="التخصص (مثال: إعلام آلي)" className="glass-input mb-3" />
          <input value={profile.institution} onChange={(e) => setProfile({...profile, institution: e.target.value})} placeholder="اسم المؤسسة التعليمية" className="glass-input mb-3" />
          <select value={profile.graduationYear} onChange={(e) => setProfile({...profile, graduationYear: e.target.value})} className="glass-input">
            <option value="">سنة التخرج</option>
            {Array.from({length: 36}, (_, i) => 2025 - i).map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-4">الشهادات المهنية</h3>
          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {profile.certificates.map((c: any, i: number) => (
              <div key={i} className="p-3 bg-[#0a1628]/5 rounded-lg flex justify-between items-center">
                <div className="text-right flex-1">
                  <p className="font-bold text-[#0a1628] text-sm">{c.name}</p>
                  <p className="text-xs text-[#0a1628]/60">{c.organization} • {c.year}</p>
                </div>
                <button onClick={() => handleRemoveCert(i)} className="text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-3">
            <input value={newCert.name} onChange={(e) => setNewCert({...newCert, name: e.target.value})} placeholder="اسم الشهادة" className="glass-input text-sm" />
            <input value={newCert.organization} onChange={(e) => setNewCert({...newCert, organization: e.target.value})} placeholder="جهة الإصدار" className="glass-input text-sm" />
            <input value={newCert.year} onChange={(e) => setNewCert({...newCert, year: e.target.value})} placeholder="السنة" className="glass-input text-sm" />
            <button onClick={handleAddCert} className="w-full p-2 bg-[#0a1628]/5 text-[#0a1628] font-bold rounded-lg flex items-center justify-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> إضافة شهادة
            </button>
          </div>
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-3">اللغات</h3>
          <div className="space-y-2">
            {["العربية", "الفرنسية", "الإنجليزية"].map(lang => (
              <label key={lang} className="flex items-center gap-3 p-2 cursor-pointer">
                <input type="checkbox" checked={profile.languages.includes(lang)} onChange={() => handleLanguageToggle(lang)} className="w-4 h-4" />
                <span className="text-[#0a1628] font-bold text-sm">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-3">المهارات التقنية</h3>
          <div className="grid grid-cols-2 gap-2">
            {TECHNICAL_SKILLS.map(skill => (
              <label key={skill} className="flex items-center gap-2 p-2 cursor-pointer">
                <input type="checkbox" checked={profile.technicalSkills.includes(skill)} onChange={() => handleSkillToggle(skill, 'technical')} className="w-4 h-4" />
                <span className="text-[#0a1628] font-bold text-xs">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-3">المهارات الناعمة</h3>
          <div className="grid grid-cols-2 gap-2">
            {SOFT_SKILLS.map(skill => (
              <label key={skill} className="flex items-center gap-2 p-2 cursor-pointer">
                <input type="checkbox" checked={profile.softSkills.includes(skill)} onChange={() => handleSkillToggle(skill, 'soft')} className="w-4 h-4" />
                <span className="text-[#0a1628] font-bold text-xs">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-4">الخبرة المهنية</h3>
          <select value={profile.yearsOfExperience} onChange={(e) => setProfile({...profile, yearsOfExperience: e.target.value})} className="glass-input mb-3">
            <option value="0">بدون خبرة</option>
            <option value="1-2">سنة إلى سنتين</option>
            <option value="3-5">3 إلى 5 سنوات</option>
            <option value="5+">أكثر من 5 سنوات</option>
          </select>
          <input value={profile.previousJobTitle} onChange={(e) => setProfile({...profile, previousJobTitle: e.target.value})} placeholder="آخر منصب عملتم فيه" className="glass-input mb-3" />
          <textarea value={profile.mainAchievements} onChange={(e) => setProfile({...profile, mainAchievements: e.target.value})} placeholder="أهم إنجازاتك المهنية" className="glass-input resize-none h-20" />
        </div>

        <div className="border-t-2 border-[#0a1628]/10 pt-4">
          <h3 className="font-black text-[#0a1628] mb-3">الروابط المهنية</h3>
          <input value={profile.githubLink} onChange={(e) => setProfile({...profile, githubLink: e.target.value})} placeholder="رابط GitHub (إن وجد)" className="glass-input mb-2 text-left" dir="ltr" />
          <input value={profile.linkedinLink} onChange={(e) => setProfile({...profile, linkedinLink: e.target.value})} placeholder="رابط LinkedIn (إن وجد)" className="glass-input text-left" dir="ltr" />
        </div>
      </div>

      <button onClick={handleContinue} disabled={isLoading} className="shimmer-button w-full text-xl mt-6">
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "المتابعة"}
      </button>
    </div>
  );
}

// Rename remaining steps and update function calls
function Step3Plan({ onNext, userId, update }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const handleContinue = async () => {
    setIsLoading(true);
    await update({ id: userId, plan: "premium", currentStep: 3 });
    setIsLoading(false);
    onNext();
  };
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-[#0a1628]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">💎</div>
      <h2 className="text-3xl font-extrabold text-[#0a1628] mb-4">الوصول الكامل مفعل</h2>
      <p className="text-[#0a1628]/70 mb-8">لقد فعلنا لك جميع المميزات المتقدمة مجاناً</p>
      <div className="space-y-4 mb-8 text-right">
        <div className="flex items-center gap-3 font-bold text-[#0a1628]"><span>✅</span> تحليل عميق مخصص</div>
        <div className="flex items-center gap-3 font-bold text-[#0a1628]"><span>✅</span> 4 وظائف موافقة</div>
        <div className="flex items-center gap-3 font-bold text-[#0a1628]"><span>✅</span> شهادة احترافية</div>
      </div>
      <button onClick={handleContinue} disabled={isLoading} className="shimmer-button w-full text-xl">
        {isLoading ? <Loader2 className="animate-spin" /> : "متابعة"}
      </button>
    </div>
  );
}

function Step4Quiz({ onNext, userId, update }: any) {
  const [quizData, setQuizData] = useState({ role: "", problemSolving: "", achievement: "", hours: "2", experience: "", goal: "" });
  const [isLoading, setIsLoading] = useState(false);
  const recommendMutation = useRecommend(userId);
  
  const handleContinue = async () => {
    if (Object.values(quizData).some(v => !v)) return alert("أجب على جميع الأسئلة");
    setIsLoading(true);
    try {
      await update({ id: userId, ...quizData, skill: quizData.role, currentStep: 4 });
      await recommendMutation.mutateAsync();
      onNext();
    } catch (err) { onNext(); } finally { setIsLoading(false); }
  };

  const questions = [
    { id: "role", label: "في العمل، أي دور يناسبك؟", options: [{ id: "leader", label: "قائد" }, { id: "fixer", label: "منفذ" }, { id: "creative", label: "مبدع" }, { id: "analyst", label: "محلل" }] },
    { id: "problemSolving", label: "عند مشكلة صعبة، ماذا تفعل أولاً؟", options: [{ id: "research", label: "أبحث" }, { id: "talk", label: "أتواصل" }, { id: "try", label: "أجرب" }, { id: "plan", label: "أخطط" }] },
    { id: "achievement", label: "ما يمنحك إنجازاً؟", options: [{ id: "creative", label: "إنجاز إبداعي" }, { id: "help", label: "مساعدة أحد" }, { id: "target", label: "هدف رقمي" }, { id: "build", label: "بناء شيء" }] },
    { id: "experience", label: "خبرتك السابقة؟", options: [{ id: "none", label: "لا خبرة" }, { id: "basic", label: "بسيطة" }, { id: "med", label: "متوسطة" }, { id: "high", label: "عالية" }] },
    { id: "goal", label: "هدفك من العمل؟", options: [{ id: "security", label: "أمان" }, { id: "growth", label: "نمو" }, { id: "freedom", label: "حرية" }, { id: "impact", label: "تأثير" }] }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-[#0a1628]">تحليل شخصيتك</h2>
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {questions.map((q) => (
          <div key={q.id}>
            <label className="block mb-3 font-bold text-[#0a1628]">{q.label}</label>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt) => (
                <button key={opt.id} onClick={() => setQuizData({...quizData, [q.id]: opt.id})} className={cn("w-full text-right p-3 rounded-xl border-2 transition-all font-bold text-sm", quizData[q.id] === opt.id ? "bg-[#0a1628] text-white" : "bg-[#0a1628]/5 border-transparent text-[#0a1628]")}>{opt.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleContinue} disabled={isLoading} className="shimmer-button w-full text-xl">
        {isLoading ? <Loader2 className="animate-spin" /> : "وظائفي"}
      </button>
    </div>
  );
}

function Step5Jobs({ onNext, userId, update, user }: any) {
  const [selectedJob, setSelectedJob] = useState(user?.selectedJob || "");
  const [isLoading, setIsLoading] = useState(false);
  const displayJobs = user?.recommendations?.jobs || [];
  const handleContinue = async () => {
    if (!selectedJob) return alert("اختر وظيفة");
    setIsLoading(true);
    await update({ id: userId, selectedJob, currentStep: 5 });
    setIsLoading(false);
    onNext();
  };
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-4 text-[#0a1628]">الوظائف الموصى بها</h2>
      <div className="space-y-3 mb-6 max-h-[55vh] overflow-y-auto pr-2">
        {displayJobs.map((job: any, i: number) => (
          <button key={i} onClick={() => setSelectedJob(job.title)} className={cn("w-full text-right p-5 rounded-2xl border-2 transition-all", selectedJob === job.title ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-[#0a1628]/5 border-transparent")}>
            <h3 className="font-black text-lg mb-1">{job.title}</h3>
            <p className={cn("text-sm mb-2", selectedJob === job.title ? "text-white/80" : "text-[#0a1628]/70")}>{job.description}</p>
            <div className="text-xs font-bold">💰 {job.salaryRange}</div>
          </button>
        ))}
      </div>
      {selectedJob && <button onClick={handleContinue} disabled={isLoading} className="shimmer-button w-full text-xl">{isLoading ? <Loader2 className="animate-spin" /> : "التعلم"}</button>}
    </div>
  );
}

function Step6Learning({ onNext, user }: any) {
  const [localPlan, setLocalPlan] = useState<any>(user?.learningPlan);
  useEffect(() => {
    if (!user?.learningPlan) {
      setLocalPlan({
        phases: [
          { days: "1-15", title: "الأساسيات", desc: "المفاهيم الأساسية والمصطلحات" },
          { days: "16-30", title: "المهارات العملية", desc: "تطبيق عملي ومشاريع" },
          { days: "31-45", title: "المتقدم", desc: "مشاريع حقيقية ومحفظة أعمال" },
          { days: "46-60", title: "التحضير", desc: "السيرة الذاتية والمقابلات" }
        ]
      });
    }
  }, [user?.learningPlan]);
  const phases = localPlan?.phases || [];
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-4 text-[#0a1628]">خطتك 60 يوماً</h2>
      <div className="space-y-3 mb-6">
        {phases.map((p: any, i: number) => (
          <div key={i} className="p-4 border-r-4 border-[#0a1628] bg-[#0a1628]/5 rounded-lg">
            <div className="flex justify-between mb-1"><h3 className="font-black text-[#0a1628]">{p.title}</h3><span className="text-xs bg-[#0a1628] text-white px-2 py-1 rounded">{p.days}</span></div>
            <p className="text-sm text-[#0a1628]/70">{p.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="shimmer-button w-full text-xl">الاختبار</button>
    </div>
  );
}

function Step7Test({ onNext, userId, user, update }: any) {
  const [questions, setQuestions] = useState<any>(user?.testQuestions?.questions || []);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!questions.length) {
      fetch("/api/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, type: "test" }) })
        .then(r => r.json())
        .then(data => setQuestions(data.questions || []))
        .catch(() => setQuestions([]));
    }
  }, []);

  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correctCount++;
    });
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    await update({ id: userId, testScore: finalScore, testAnswers: answers, currentStep: 7 });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (submitted) {
    return (
      <div className="text-center">
        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl", score >= 70 ? "bg-[#0a1628] text-[#C9A84C]" : "bg-red-500 text-white")}>
          {score >= 70 ? "🎉" : "⚠️"}
        </div>
        <h2 className={cn("text-3xl font-black mb-4", score >= 70 ? "text-[#0a1628]" : "text-red-600")}>
          {score >= 70 ? "مبروك! جاهز" : "حاول مجدداً"}
        </h2>
        <p className="text-2xl font-black text-[#C9A84C] mb-6">{score}%</p>
        {score >= 70 ? (
          <button onClick={onNext} className="shimmer-button w-full text-xl">الشهادة</button>
        ) : (
          <button onClick={() => { setSubmitted(false); setAnswers([]); setTimeLeft(20 * 60); }} className="shimmer-button w-full text-xl">إعادة</button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold text-[#0a1628]">الاختبار النهائي</h2>
        <div className={cn("text-sm font-black px-3 py-1 rounded", timeLeft < 300 ? "bg-red-500 text-white" : "bg-[#0a1628] text-[#C9A84C]")}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 mb-4">
        {questions.map((q: any, i: number) => (
          <div key={q.id} className="p-4 bg-[#0a1628]/5 rounded-lg border-2 border-[#0a1628]/20">
            <p className="font-bold text-[#0a1628] mb-3 text-sm">{i + 1}. {q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt: string, idx: number) => (
                <button key={idx} onClick={() => setAnswers([...answers.slice(0, i), idx, ...answers.slice(i + 1)])} className={cn("w-full text-right p-2 rounded-lg transition-all border-2 font-bold text-xs", answers[i] === idx ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-white border-[#0a1628]/20")}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={answers.length < questions.length} className="shimmer-button w-full text-xl">
        تسليم
      </button>
    </div>
  );
}

function Step8Certificate({ onNext, user }: any) {
  const certRef = useRef<HTMLDivElement>(null);
  const handleDownload = () => {
    if (certRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#C9A84C';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#0a1628';
        ctx.fillRect(20, 20, 760, 560);
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 40px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('شهادة كفاءة مهنية', 400, 100);
        ctx.font = '24px Cairo';
        ctx.fillText('مستقبلي', 400, 150);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Cairo';
        ctx.fillText(user?.name || 'المتدرب', 400, 250);
        ctx.font = '20px Cairo';
        ctx.fillStyle = '#C9A84C';
        ctx.fillText(`${user?.selectedJob}`, 400, 320);
        ctx.fillText(`${user?.testScore || 85}%`, 400, 370);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Certificate_${user?.name}.png`;
        link.click();
      }
    }
  };

  return (
    <div className="text-center">
      <div ref={certRef} className="w-full h-96 bg-gradient-to-br from-[#C9A84C] to-[#FFD700] rounded-2xl p-8 text-[#0a1628] flex flex-col justify-center items-center mb-8 shadow-2xl border-4 border-[#0a1628]">
        <h2 className="text-4xl font-black mb-2">شهادة</h2>
        <p className="text-sm mb-8 opacity-90">مستقبلي</p>
        <h3 className="text-3xl font-black mb-6">{user?.name}</h3>
        <p className="text-sm font-bold mb-4">{user?.selectedJob}</p>
        <p className="text-2xl font-black">{user?.testScore}%</p>
      </div>
      <button onClick={handleDownload} className="shimmer-button w-full text-xl mb-4 flex items-center justify-center gap-2">
        <Download className="w-6 h-6" /> تحميل
      </button>
      <button onClick={onNext} className="w-full p-4 rounded-2xl bg-[#0a1628] text-[#C9A84C] font-bold text-xl">
        الشركات
      </button>
    </div>
  );
}

function Step9Companies({ onNext }: any) {
  const companies = [
    { name: "سوناطراك", sector: "نفط", type: "ثابت", email: "careers@sonatrach.dz", flag: "🇩🇿" },
    { name: "جيزي", sector: "اتصالات", type: "تدريب", email: "rh@djezzy.dz", flag: "🇩🇿" },
    { name: "ياسير", sector: "تقنية", type: "ثابت", email: "jobs@yassir.io", flag: "🇩🇿" },
    { name: "سونلغاز", sector: "طاقة", type: "ثابت", email: "recrutement@sonelgaz.dz", flag: "🇩🇿" },
    { name: "أوريدو", sector: "اتصالات", type: "تدريب", email: "carriere@ooredoo.dz", flag: "🇩🇿" },
    { name: "بنك BNA", sector: "مالية", type: "ثابت", email: "recrutement@bna.dz", flag: "🇩🇿" },
    { name: "تمتم", sector: "تقنية", type: "بُعد", email: "jobs@temtem.dz", flag: "🇩🇿" },
    { name: "Upwork", sector: "حر", type: "دولار", email: "www.upwork.com", flag: "🌍" },
    { name: "Fiverr", sector: "خدمات", type: "دولية", email: "www.fiverr.com", flag: "🌍" },
    { name: "LinkedIn", sector: "وظائف", type: "عالمية", email: "www.linkedin.com", flag: "🌍" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-4 text-[#0a1628]">الشركات</h2>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 mb-6">
        {companies.map((c, i) => (
          <a key={i} href={`mailto:${c.email}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-[#0a1628]/5 border-2 border-[#0a1628]/20 hover:border-[#0a1628] transition-all block">
            <div className="flex justify-between items-start">
              <div className="text-right flex-1">
                <h3 className="font-black text-[#0a1628]">{c.name} {c.flag}</h3>
                <p className="text-xs text-[#0a1628]/60 font-bold">{c.sector} • {c.type}</p>
                <p className="text-xs text-[#C9A84C] font-bold mt-1">{c.email}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <button onClick={onNext} className="shimmer-button w-full text-xl">إنهاء</button>
    </div>
  );
}

function Step10Result({ user, onRestart }: any) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-[#0a1628] text-[#C9A84C] rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-2xl animate-bounce">🏆</div>
      <h2 className="text-3xl font-black text-[#0a1628] mb-4">مبروك {user?.name?.split(' ')[0]}!</h2>
      <p className="text-[#0a1628]/70 mb-8 text-lg font-bold">أنت الآن جاهز لسوق العمل</p>
      <div className="p-6 bg-[#0a1628] text-white rounded-2xl shadow-2xl mb-8 text-right space-y-2 border-2 border-[#C9A84C]">
        <p className="text-sm">📍 {user?.wilaya}</p>
        <p className="text-sm">🏢 {user?.selectedJob}</p>
        <p className="text-sm">📊 {user?.testScore}%</p>
      </div>
      <button onClick={onRestart} className="shimmer-button w-full text-xl">ابدأ من جديد</button>
    </div>
  );
}
