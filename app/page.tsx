import Link from "next/link";
import { GovtHeader } from "@/components/public/GovtHeader";
import { GovtFooter } from "@/components/public/GovtFooter";
import { StatusChecker } from "@/components/public/StatusChecker";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter,
  Chip,
  Accordion,
  AccordionItem,
  Divider
} from "@/components/ui/heroui";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  FileText,
  Briefcase,
  Users,
  ClipboardCheck,
  Award,
  ArrowRight,
  FolderLock,
  Save,
  CreditCard,
  Activity,
  MessageSquareReply,
  ExternalLink,
  Calendar,
  Scale,
  Clock,
  UserCheck,
  ShieldCheck,
  Upload,
  Search,
  BookOpen,
  Send,
  Globe,
  ChevronRight
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";

/* ─── Data Fetching ─── */
async function getActivePosts() {
  try {
    return await prisma.recruitmentPost.findMany({
      where: { isActive: true },
      take: 5,
      orderBy: { closingDate: "asc" },
    });
  } catch {
    return [];
  }
}

/* ─── Static Data ─── */
const stats = [
  { label: "Active Posts", value: "12", icon: Briefcase, color: "text-teams-ocean", bg: "bg-teams-ocean/10" },
  { label: "Registered Applicants", value: "4,850+", icon: Users, color: "text-success", bg: "bg-success/10" },
  { label: "Applications Received", value: "18,200+", icon: ClipboardCheck, color: "text-teams-iris", bg: "bg-teams-iris/10" },
  { label: "Posts Filled", value: "156", icon: Award, color: "text-warning", bg: "bg-warning/10" },
];

const howToApplySteps = [
  { title: "Register", description: "Create your account with email or mobile OTP verification.", icon: UserCheck },
  { title: "Consent & Profile", description: "Accept DPDP consent and complete your basic profile details.", icon: ShieldCheck },
  { title: "Upload Documents", description: "Upload certificates, photos, and ID proofs to your Document Vault.", icon: Upload },
  { title: "Select Post & Apply", description: "Choose an active recruitment post and fill the application form.", icon: Search },
  { title: "Eligibility Check", description: "Automatic eligibility validation based on DoPT/CSIR rules and crucial date.", icon: BookOpen },
  { title: "Pay Fee & Submit", description: "Pay the application fee online and submit your complete application.", icon: Send },
  { title: "Track & Respond", description: "Track application status, respond to scrutiny deficiencies, and download acknowledgement.", icon: Activity },
];

const recruitmentRules = [
  { title: "DoPT Age Relaxation", summary: "Age relaxation for SC/ST (5 years), OBC-NCL (3 years), PwBD (10 years), Ex-Servicemen, Meritorious Sportspersons, J&K domicile, and widows/divorced women as per Government of India orders.", icon: Calendar },
  { title: "CSIR Recruitment Rules", summary: "All posts are filled as per CSIR Recruitment & Assessment Rules. Selection process includes screening, written examination, interview, and skill test as applicable.", icon: Scale },
  { title: "Reservation Policy", summary: "Vacancies are reserved for SC, ST, OBC-NCL, EWS, and PwBD categories as per Government of India reservation policy with horizontal and vertical reservation matrix.", icon: Users },
  { title: "Crucial Date", summary: "The crucial date for determining age, qualification, and experience is the closing date of the advertisement unless specified otherwise.", icon: Clock },
];

const selfServiceFeatures = [
  { title: "Document Vault", description: "Upload and manage reusable documents — certificates, photos, IDs — across multiple applications.", icon: FolderLock },
  { title: "Draft Autosave", description: "Your application ProgressBar is automatically saved. Return anytime to complete and submit.", icon: Save },
  { title: "Payment Tracking", description: "Track application fee payment status with gateway reference and receipt download.", icon: CreditCard },
  { title: "Status Tracking", description: "Real-time application status tracking from submission through scrutiny to final approval.", icon: Activity },
  { title: "Deficiency Response", description: "Respond to scrutiny deficiency queries and upload corrected documents directly from your dashboard.", icon: MessageSquareReply },
];

const importantLinks = [
  { label: "CSIR Website", href: "https://www.csir.res.in", icon: Globe },
  { label: "CSIR-SERC Website", href: "https://serc.res.in", icon: Globe },
  { label: "DoPT Orders", href: "https://dopt.gov.in", icon: ExternalLink },
  { label: "Digital India", href: "https://www.digitalindia.gov.in", icon: ExternalLink },
];

export default async function HomePage() {
  const posts = await getActivePosts();

  return (
    <div className="min-h-screen bg-[#fafafa]" id="main">
      <GovtHeader />

      {/* ══════════════════════════════════════
          §1  HERO SECTION
          ══════════════════════════════════════ */}
      <section className="bg-gradient-hero py-16 lg:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-teams-slate/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-teams-iris/20 blur-3xl opacity-50" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 animate-fade-in-up">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            
            {/* Left Content */}
            <div className="text-white">
              <Chip 
                startContent={<ShieldCheck size={16} />} 
                variant="primary" 
                className="bg-success/20 text-success-200 border-none mb-6"
              >
                Government of India · CSIR-SERC
              </Chip>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
                Transparent, Rule-Based <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teams-slate">
                  Recruitment Portal
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Apply online for scientific and technical positions at CSIR-SERC.
                Manage reusable documents, track payment, respond to scrutiny
                queries, and download submitted applications — all through a secure,
                self-service applicant dashboard.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button 
                   
                  href="/applicant/dashboard" 
                  variant="primary" 
                  size="lg"
                  className="bg-white text-teams-ocean font-bold shadow-lg hover:bg-white/90"
                  icon={<FileText size={18} />}
                >
                  Applicant Dashboard
                </Button>
                <Button 
                   
                  href="/auth/login" 
                  variant="bordered" 
                  size="lg"
                  className="text-white border-white/40 hover:bg-white/10 font-medium"
                  icon={<ArrowRight size={18} />}
                >
                  Login / Register
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "DoPT/CSIR rule-aware eligibility",
                  "Document vault for applicants",
                  "CVC-style audit transparency",
                  "WCAG / GIGW responsive interface",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <CheckCircle2 className="text-success-400" size={18} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Active Notices Card */}
            <Card className="glass-panel-dark border-none shadow-2xl p-2 w-full animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-teams-slate" />
                  Active Recruitment Notices
                </h2>
              </CardHeader>
              <CardContent className="py-5 px-6">
                <div className="flex flex-col gap-4">
                  {posts.length > 0 ? (
                    posts.map((p) => (
                      <div key={p.id} className="bg-white/10 rounded-xl p-4 border border-white/5 hover:bg-white/20 transition-colors">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-semibold text-white">{p.title}</h3>
                          <Chip size="sm" variant="ghost" className="bg-success/20 text-success-200 border-none shrink-0">Open</Chip>
                        </div>
                        <p className="mt-2 text-xs text-white/60">
                          Advt. No: {p.advertisementNo} · Closing: {p.closingDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        <Link href="/jobs" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teams-slate hover:text-white transition-colors">
                          View details <ArrowRight size={14} />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/10 rounded-xl p-5 border border-white/5 text-center">
                      <p className="text-sm text-white/70">
                        No active recruitment posts at this time. Please check back later.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §2  STATS COUNTER
          ══════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={stat.label}  className="border-none shadow-md animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="flex flex-row items-center gap-4 p-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-teams-dark">{stat.value}</p>
                  <p className="text-xs font-semibold text-foreground-500 uppercase tracking-wide mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          §3  HOW TO APPLY
          ══════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-teams-dark">How to Apply</h2>
          <p className="mt-4 text-foreground-600">Follow these 7 simple steps to complete your application online through our self-service portal.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {howToApplySteps.map((step, i) => (
            <Card key={step.title}  className="border border-teams-border/40 hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10 text-teams-ocean group-hover:scale-110 transition-transform">
                    <step.icon size={24} />
                  </div>
                  <span className="text-4xl font-black text-teams-border/30 group-hover:text-teams-ocean/20 transition-colors">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-teams-dark">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          §4  RECRUITMENT RULES & FEATURES
          ══════════════════════════════════════ */}
      <section className="bg-white border-y border-teams-border/40 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Self Service Features */}
            <div>
              <h2 className="text-3xl font-bold text-teams-dark">Applicant Self-Service</h2>
              <p className="mt-4 text-foreground-600 mb-8">Everything you need to manage your recruitment journey from a single dashboard.</p>
              
              <div className="space-y-6">
                {selfServiceFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teams-ocean/10 text-teams-ocean mt-1">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-teams-dark">{feature.title}</h3>
                      <p className="mt-1 text-sm text-foreground-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recruitment Rules */}
            <div>
              <h2 className="text-3xl font-bold text-teams-dark mb-8">Rules &amp; Policies</h2>
              <Accordion variant="splitted" selectionMode="multiple">
                {recruitmentRules.map((rule) => (
                  <AccordionItem 
                    key={rule.title} 
                    aria-label={rule.title} 
                    title={<span className="font-semibold text-teams-dark">{rule.title}</span>}
                    startContent={<div className="p-2 rounded-lg bg-teams-gray text-teams-ocean"><rule.icon size={18} /></div>}
                    indicator={<ChevronRight size={18} />}
                    className="shadow-sm border border-teams-border/40"
                  >
                    <p className="text-sm text-foreground-600 leading-relaxed pb-3 px-2">
                      {rule.summary}
                    </p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §5  APPLICATION STATUS CHECK
          ══════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8 py-20">
        <StatusChecker />
      </section>

      {/* ══════════════════════════════════════
          §6  IMPORTANT LINKS
          ══════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-10 mb-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-teams-border/50 flex-1" />
          <h2 className="text-sm font-bold tracking-widest uppercase text-foreground-500">Important Links</h2>
          <div className="h-px bg-teams-border/50 flex-1" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {importantLinks.map((link) => (
            <Button
              key={link.label}
              
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              className="h-auto py-4 flex flex-col gap-2 bg-teams-gray hover:bg-teams-border/30 transition-colors"
            >
              <link.icon size={20} className="text-teams-ocean mb-1" />
              <span className="text-xs font-semibold text-teams-dark truncate w-full text-center">{link.label}</span>
            </Button>
          ))}
        </div>
      </section>

      <GovtFooter />
    </div>
  );
}

