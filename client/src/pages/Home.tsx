import { Wizard } from "@/components/WizardSteps";

export default function Home() {
  return (
    <main className="w-full relative overflow-hidden bg-[#0a1628]">
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Interactive Wizard Component */}
      <div className="relative z-10">
        <Wizard />
      </div>
    </main>
  );
}
