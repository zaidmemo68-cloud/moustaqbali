import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const STATIC_RECOMMENDATIONS = {
  jobs: [
    { title: "مطور مواقع ويب", description: "بناء مواقع ومتاجر إلكترونية احترافية", salaryRange: "80,000 - 150,000 دج", demandLevel: "طلب عالي جداً 🔥", companies: ["سوناطراك", "جيزي", "ياسير"], remotePossible: true },
    { title: "مسؤول IT وشبكات", description: "إدارة الأنظمة والشبكات للمؤسسات", salaryRange: "60,000 - 120,000 دج", demandLevel: "مطلوب في كل مؤسسة", companies: ["سوناطراك", "سونلغاز", "بنك BNA"], remotePossible: false },
    { title: "محلل بيانات", description: "تحليل البيانات واتخاذ القرارات الذكية", salaryRange: "90,000 - 180,000 دج", demandLevel: "مستقبل الأعمال 📈", companies: ["جيزي", "أوريدو", "ياسير"], remotePossible: true },
    { title: "مصمم تجربة مستخدم UI/UX", description: "تصميم واجهات سهلة وجذابة للتطبيقات", salaryRange: "70,000 - 140,000 دج", demandLevel: "نمو سريع 🎨", companies: ["تمتم", "ياسير", "جيزي"], remotePossible: true }
  ]
};

const STATIC_TEST = {
  questions: [
    { id: 1, text: "ما هو الفرق الرئيسي بين HTML و CSS؟", options: ["HTML يصف المحتوى و CSS يصف التصميم", "HTML والـ CSS متطابقان", "HTML يستخدم للتصميم فقط", "CSS يستخدم للمحتوى فقط"], correctAnswer: 0 },
    { id: 2, text: "أي من التالي يعتبر لغة برمجة؟", options: ["HTML", "CSS", "JavaScript", "جميع ما سبق"], correctAnswer: 2 },
    { id: 3, text: "ما هو الهدف من استخدام قاعدة البيانات؟", options: ["تخزين البيانات", "عرض التطبيق", "تصميم الواجهة", "لا شيء"], correctAnswer: 0 },
    { id: 4, text: "كيف تبدأ مشروعاً برمجياً ناجحاً؟", options: ["البدء بالكود مباشرة", "التخطيط والتصميم أولاً", "نسخ كود من الإنترنت", "عدم التخطيط"], correctAnswer: 1 },
    { id: 5, text: "ما أهمية الـ Version Control في التطوير؟", options: ["تتبع التغييرات", "تسريع الكمبيوتر", "تقليل حجم الملفات", "لا فائدة منه"], correctAnswer: 0 },
    { id: 6, text: "أي من الشركات التالية توظف مطورين في الجزائر؟", options: ["جيزي وياسير وسوناطراك", "فقط شركات أجنبية", "لا أحد", "الحكومة فقط"], correctAnswer: 0 },
    { id: 7, text: "ما أفضل طريقة للتعلم المستمر في المجال التقني؟", options: ["المشاريع العملية والممارسة", "حفظ المعلومات فقط", "قراءة الكتب القديمة", "عدم التعلم"], correctAnswer: 0 },
    { id: 8, text: "كم ساعة يومياً يجب تخصيصها للتعلم والممارسة؟", options: ["30 دقيقة", "ساعة واحدة على الأقل", "5 ساعات", "لا توجد ساعات محددة"], correctAnswer: 1 },
    { id: 9, text: "ما أهم مهارة في سوق العمل الحالي؟", options: ["الاتصال والتواصل", "حل المشاكل", "التعاون والعمل الجماعي", "جميع ما سبق"], correctAnswer: 3 },
    { id: 10, text: "كيف تحصل على وظيفة في شركة كبرى في الجزائر؟", options: ["تطوير مهاراتك وبناء محفظة أعمالك", "الواسطة فقط", "السؤال المباشر", "الحظ"], correctAnswer: 0 }
  ]
};

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.users.get.path, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.put(api.users.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const input = api.users.update.input.parse(req.body);
      const user = await storage.updateUser(id, input);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/recommend", async (req, res) => {
    const { prompt: userPrompt, userId, type } = req.body;
    try {
      if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "ANTHROPIC_API_KEY") {
        console.warn("Using fallback AI data due to missing or placeholder key");
        return res.json(type === 'plan' ? { phases: [] } : type === 'test' ? STATIC_TEST : STATIC_RECOMMENDATIONS);
      }

      const systemPrompt = type === 'test' ? `أنت خبير في إنشاء اختبارات تقييم مهنية بالعربية. قم بإنشاء 10 أسئلة متعددة الخيارات حول الوظيفة المطلوبة. كل سؤال يجب أن يكون له 4 خيارات واحد منها صحيح.
Response must be ONLY a JSON with structure: {"questions": [{"id": 1, "text": "السؤال", "options": ["خ1", "خ2", "خ3", "خ4"], "correctAnswer": 0}]}` : `أنت مستشار مهني متخصص في سوق العمل الجزائري.`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt || "Create 10 test questions" }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      const data = JSON.parse(content);

      if (userId && type === 'test') {
        await storage.updateUser(userId, { testQuestions: data });
      }
      res.json(data);
    } catch (err) {
      console.error("AI Generation error:", err);
      res.json(type === 'test' ? STATIC_TEST : STATIC_RECOMMENDATIONS);
    }
  });

  app.post(api.users.recommend.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await storage.getUser(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "ANTHROPIC_API_KEY") {
        await storage.updateUser(id, { recommendations: STATIC_RECOMMENDATIONS });
        return res.json(STATIC_RECOMMENDATIONS);
      }

      const systemPrompt = `أنت مستشار مهني متخصص في سوق العمل الجزائري.`;
      const userPrompt = `Based on user (${user.skill}), suggest 4 jobs with Algerian companies.`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      const recommendations = JSON.parse(content);
      await storage.updateUser(id, { recommendations });
      res.json(recommendations);
    } catch (err) {
      console.error("AI Recommendation error:", err);
      res.json(STATIC_RECOMMENDATIONS);
    }
  });

  app.get(api.admin.stats.path, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const totalUsers = allUsers.length;
      const usersWithScores = allUsers.filter(u => u.testScore);
      const averageScore = usersWithScores.length > 0 ? Math.round(usersWithScores.reduce((sum, u) => sum + (u.testScore || 0), 0) / usersWithScores.length) : 0;

      const jobCounts = new Map<string, number>();
      allUsers.forEach(u => {
        if (u.selectedJob) {
          jobCounts.set(u.selectedJob, (jobCounts.get(u.selectedJob) || 0) + 1);
        }
      });
      const topJobs = Array.from(jobCounts.entries()).map(([title, count]) => ({ title, count })).sort((a, b) => b.count - a.count).slice(0, 5);

      res.json({ totalUsers, averageScore, topJobs });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
