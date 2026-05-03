import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Zap } from "lucide-react";

export default function Admin() {
  const [stats, setStats] = useState({ totalUsers: 0, averageScore: 0, topJobs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
      <div style={{ background: "linear-gradient(135deg, #C9A84C 0%, #FFD700 100%)" }} className="min-h-screen" />
      <div className="max-w-4xl w-full mx-auto relative z-10">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-[#0a1628] mb-12 text-center">
          لوحة التحكم الإدارية
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
            <h3 className="text-sm text-[#0a1628]/60 font-bold mb-2">عدد المستخدمين</h3>
            <p className="text-4xl font-black text-[#0a1628]">{stats.totalUsers}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 text-center">
            <TrendingUp className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
            <h3 className="text-sm text-[#0a1628]/60 font-bold mb-2">متوسط النتائج</h3>
            <p className="text-4xl font-black text-[#0a1628]">{stats.averageScore}%</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-8 text-center">
            <Zap className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
            <h3 className="text-sm text-[#0a1628]/60 font-bold mb-2">الوظائف الأكثر طلباً</h3>
            <p className="text-2xl font-black text-[#0a1628]">{stats.topJobs.length}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-black text-[#0a1628] mb-6">الوظائف الأكثر اختياراً</h2>
          <div className="space-y-4">
            {stats.topJobs.length === 0 ? (
              <p className="text-center text-[#0a1628]/60 font-bold py-8">لا توجد بيانات حتى الآن</p>
            ) : (
              stats.topJobs.map((job: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0a1628]/5 rounded-xl border-r-4 border-[#0a1628]">
                  <div className="text-right flex-1">
                    <h3 className="font-black text-[#0a1628]">{job.title}</h3>
                    <p className="text-sm text-[#0a1628]/60">{job.count} متدرب</p>
                  </div>
                  <div className="h-8 bg-[#0a1628]/20 rounded-full flex items-center px-4">
                    <div style={{ width: `${Math.min(job.count * 20, 100)}px` }} className="h-2 bg-[#C9A84C] rounded-full" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <div className="text-center mt-12">
          <a href="/" className="inline-block shimmer-button px-8 py-3 text-lg">
            العودة للتطبيق
          </a>
        </div>
      </div>
    </div>
  );
}
