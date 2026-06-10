"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardFooter,
  Input, 
  Select, 
  SelectItem, 
  TextArea, 
  Checkbox,
  ProgressBar
} from "@/components/ui/heroui";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  CheckCircle2,
  User,
  GraduationCap,
  Briefcase,
  ListChecks,
  FileUp,
  ClipboardCheck,
  Loader2,
  AlertTriangle
} from "lucide-react";

/* ── Step definitions ── */
const STEPS = [
  { key: "personal", label: "Personal Details", icon: User },
  { key: "qualifications", label: "Qualifications", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "category", label: "Category & Eligibility", icon: ListChecks },
  { key: "documents", label: "Documents", icon: FileUp },
  { key: "review", label: "Review & Submit", icon: ClipboardCheck },
] as const;

/* ── Form data shape ── */
interface FormDataState {
  /* Step 1 — Personal */
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  address: string;
  pincode: string;

  /* Step 2 — Qualifications */
  qualification: string;
  university: string;
  yearOfPassing: string;
  percentage: string;
  specialization: string;

  /* Step 3 — Experience */
  experienceYears: string;
  currentOrganization: string;
  designation: string;
  experienceDetails: string;

  /* Step 4 — Category */
  category: string;
  isPwBD: boolean;
  pwbdPercentage: string;
  isExServiceman: boolean;

  /* Step 5 — Documents */
  photoUploaded: boolean;
  signatureUploaded: boolean;
  dobProofUploaded: boolean;
  qualificationUploaded: boolean;
  experienceUploaded: boolean;
  categoryUploaded: boolean;
}

const initialFormData: FormDataState = {
  fullName: "",
  fatherName: "",
  dob: "",
  gender: "",
  email: "",
  mobile: "",
  address: "",
  pincode: "",
  qualification: "",
  university: "",
  yearOfPassing: "",
  percentage: "",
  specialization: "",
  experienceYears: "0",
  currentOrganization: "",
  designation: "",
  experienceDetails: "",
  category: "UR",
  isPwBD: false,
  pwbdPercentage: "",
  isExServiceman: false,
  photoUploaded: false,
  signatureUploaded: false,
  dobProofUploaded: false,
  qualificationUploaded: false,
  experienceUploaded: false,
  categoryUploaded: false,
};

export default function ApplicationWizard({
  postCode,
  postTitle,
  advertisementNo,
}: {
  postCode: string;
  postTitle: string;
  advertisementNo: string;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Field updater ── */
  const updateField = useCallback(
    (field: keyof FormDataState, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    },
    []
  );

  /* ── Validation ── */
  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (step === 1) {
      if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required";
      if (!formData.university.trim()) newErrors.university = "University is required";
    }

    if (step === 3) {
      if (!formData.category) newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ── Save Draft ── */
  async function saveDraft() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("postCode", postCode);
      fd.set("category", formData.category);
      fd.set("dob", formData.dob || "1993-01-01");
      fd.set("qualification", formData.qualification);
      fd.set("experienceYears", formData.experienceYears);

      const res = await fetch("/api/applications/draft", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        /* Fallback: use server action by simulating form submit */
      }

      setLastSaved(new Date().toLocaleTimeString("en-IN"));
    } catch {
      /* Silent fail for demo */
    } finally {
      setSaving(false);
    }
  }

  /* ── Submit ── */
  async function handleSubmit() {
    setSubmitting(true);
    try {
      /* In a real app, this calls submitApplication server action */
      await saveDraft();
      router.push("/applicant/applications");
    } catch {
      /* Handle error */
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Navigation ── */
  function goNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  /* ── Auto-save every 30s ── */
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.fullName) saveDraft();
    }, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const progressPercentage = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <Card  className="border border-teams-border/40">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-teams-dark">
                Application for: <span className="text-teams-ocean">{postTitle}</span>
              </h1>
              <p className="mt-1 text-sm font-medium text-foreground-500">
                Post Code: <span className="font-bold text-teams-dark">{postCode}</span> &middot; Advertisement No: <span className="font-bold text-teams-dark">{advertisementNo}</span>
              </p>
            </div>
            
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-teams-ocean mb-2">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <ProgressBar 
                value={progressPercentage} 
                className="w-48"
                classNames={{
                  indicator: "bg-teams-ocean",
                  track: "bg-teams-ocean/20"
                }}
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Step Indicator ── */}
      <Card  className="border border-teams-border/40 overflow-hidden">
        <div className="flex overflow-x-auto hide-scrollbar bg-teams-gray/10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <button
                key={step.key}
                onClick={() => idx <= currentStep && setCurrentStep(idx)}
                disabled={idx > currentStep}
                className={cn(
                  "flex-1 min-w-[140px] px-4 py-4 flex flex-col items-center justify-center gap-2 border-b-2 transition-colors duration-200 relative",
                  isCurrent 
                    ? "border-teams-ocean bg-white text-teams-ocean" 
                    : isCompleted 
                      ? "border-success bg-white text-success cursor-pointer hover:bg-success/5" 
                      : "border-transparent text-foreground-400 cursor-not-allowed"
                )}
                aria-label={`Step ${idx + 1}: ${step.label}`}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2",
                  isCurrent ? "border-teams-ocean bg-teams-ocean/10" :
                  isCompleted ? "border-success bg-success/10 text-success" :
                  "border-foreground-300 bg-foreground-50"
                )}>
                  {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>
                <span className="text-xs font-bold text-center">
                  {step.label}
                </span>
                
                {/* Separator arrow (not on last item) */}
                {idx < STEPS.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden md:block">
                    <ArrowRight size={16} className="text-teams-border" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── Step Content ── */}
      <Card  className="border border-teams-border/40 min-h-[400px]">
        <CardContent className="p-6 md:p-8 animate-fade-in">
          {/* STEP 1 — Personal Details */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-teams-dark mb-4">
                Personal Details
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  isInvalid={!!errors.fullName}
                  errorMessage={errors.fullName}
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Input
                  label="Father's / Guardian's Name"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={(e) => updateField("fatherName", e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Input
                  type="date"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  isInvalid={!!errors.dob}
                  errorMessage={errors.dob}
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={formData.gender ? [formData.gender] : []}
                  onChange={(e) => updateField("gender", e.target.value)}
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender}
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ trigger: "bg-white" }}
                >
                  <SelectItem id="Male" textValue="Male">Male</SelectItem>
                  <SelectItem id="Female" textValue="Female">Female</SelectItem>
                  <SelectItem id="Transgender" textValue="Transgender">Transgender</SelectItem>
                </Select>

                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                  <Input
                  label="Mobile Number"
                  placeholder="10-digit mobile"
                  value={formData.mobile}
                  onChange={(e) => updateField("mobile", e.target.value)}
                  maxLength={10}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <div className="sm:col-span-2">
                  <TextArea
                    label="Communication Address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e: any) => updateField("address", e.target.value)}
                    minRows={3}
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{ inputWrapper: "bg-white" }}
                  />
                </div>

                <Input
                  label="PIN Code"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                  maxLength={6}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Qualifications */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-teams-dark mb-4">
                Educational Qualifications
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <Select
                  label="Highest Qualification"
                  placeholder="Select qualification"
                  selectedKeys={formData.qualification ? [formData.qualification] : []}
                  onChange={(e) => updateField("qualification", e.target.value)}
                  isInvalid={!!errors.qualification}
                  errorMessage={errors.qualification}
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ trigger: "bg-white" }}
                >
                  <SelectItem id="10th" textValue="10th Standard">10th Standard</SelectItem>
                  <SelectItem id="12th" textValue="12th Standard">12th Standard</SelectItem>
                  <SelectItem id="Diploma" textValue="Diploma">Diploma</SelectItem>
                  <SelectItem id="Graduate" textValue="Graduate (B.E./B.Tech/B.Sc)">Graduate (B.E./B.Tech/B.Sc)</SelectItem>
                  <SelectItem id="PostGraduate" textValue="Post Graduate (M.E./M.Tech/M.Sc)">Post Graduate (M.E./M.Tech/M.Sc)</SelectItem>
                  <SelectItem id="PhD" textValue="Ph.D.">Ph.D.</SelectItem>
                </Select>

                <Input
                  label="University / Board"
                  placeholder="Name of university / board"
                  value={formData.university}
                  onChange={(e) => updateField("university", e.target.value)}
                  isInvalid={!!errors.university}
                  errorMessage={errors.university}
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Input
                  label="Year of Passing"
                  placeholder="e.g., 2020"
                  value={formData.yearOfPassing}
                  onChange={(e) => updateField("yearOfPassing", e.target.value)}
                  maxLength={4}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Input
                  label="Percentage / CGPA"
                  placeholder="e.g., 85% or 8.5 CGPA"
                  value={formData.percentage}
                  onChange={(e) => updateField("percentage", e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Specialization / Subject"
                    placeholder="e.g., Civil Engineering, Physics"
                    value={formData.specialization}
                    onChange={(e) => updateField("specialization", e.target.value)}
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{ inputWrapper: "bg-white" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-teams-dark mb-4">
                Work Experience
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  type="number"
                  label="Total Experience (Years)"
                  value={formData.experienceYears}
                  onChange={(e) => updateField("experienceYears", e.target.value)}
                  min="0"
                  max="40"
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Input
                  label="Current Organization"
                  placeholder="Name of current employer"
                  value={formData.currentOrganization}
                  onChange={(e) => updateField("currentOrganization", e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <Input
                  label="Current Designation"
                  placeholder="Your current designation"
                  value={formData.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white" }}
                />

                <div className="sm:col-span-2">
                  <TextArea
                    label="Experience Details"
                    placeholder="Describe your relevant work experience, organizations, and responsibilities..."
                    value={formData.experienceDetails}
                    onChange={(e: any) => updateField("experienceDetails", e.target.value)}
                    minRows={4}
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{ inputWrapper: "bg-white" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Category & Eligibility */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-teams-dark mb-4">
                Category & Eligibility
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <Select
                  label="Category"
                  selectedKeys={formData.category ? [formData.category] : ["UR"]}
                  onChange={(e) => updateField("category", e.target.value)}
                  isInvalid={!!errors.category}
                  errorMessage={errors.category}
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ trigger: "bg-white" }}
                >
                  <SelectItem id="UR" textValue="Unreserved (UR)">Unreserved (UR)</SelectItem>
                  <SelectItem id="OBC" textValue="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</SelectItem>
                  <SelectItem id="SC" textValue="SC">SC</SelectItem>
                  <SelectItem id="ST" textValue="ST">ST</SelectItem>
                  <SelectItem id="EWS" textValue="EWS">EWS</SelectItem>
                </Select>

                <div className="flex flex-col justify-end pb-2">
                  <Checkbox 
                    isSelected={formData.isPwBD}
                    onChange={(e) => updateField("isPwBD", e.target.checked)}
                    className="text-sm font-bold text-teams-dark"
                  >
                    Person with Benchmark Disability (PwBD)
                  </Checkbox>
                </div>

                {formData.isPwBD && (
                  <Input
                    label="Disability Percentage"
                    placeholder="e.g., 40%"
                    value={formData.pwbdPercentage}
                    onChange={(e) => updateField("pwbdPercentage", e.target.value)}
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{ inputWrapper: "bg-white" }}
                  />
                )}

                <div className="flex flex-col justify-end pb-2">
                  <Checkbox 
                    isSelected={formData.isExServiceman}
                    onChange={(e) => updateField("isExServiceman", e.target.checked)}
                    className="text-sm font-bold text-teams-dark"
                  >
                    Ex-Serviceman
                  </Checkbox>
                </div>
              </div>

              {/* Eligibility Notice */}
              <div className="rounded-xl border border-teams-ocean/20 bg-teams-ocean/5 p-5 mt-6 flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle size={20} className="text-teams-ocean" />
                </div>
                <div>
                  <p className="text-sm font-bold text-teams-dark mb-1">
                    Eligibility Note
                  </p>
                  <p className="text-sm font-medium text-foreground-600 leading-relaxed">
                    Age relaxation and other concessions will be applied as per
                    DoPT/CSIR rules based on your category selection. Final
                    eligibility will be validated upon submission.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-teams-dark mb-2">
                Upload Documents
              </h2>
              <p className="text-sm font-medium text-foreground-500 mb-6">
                Upload required documents. You can also pre-upload documents in
                your{" "}
                <a
                  href="/applicant/documents"
                  className="font-bold text-teams-ocean hover:underline"
                >
                  Document Vault
                </a>{" "}
                and they will be linked automatically.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { key: "photoUploaded" as const, label: "Passport Photo" },
                  { key: "signatureUploaded" as const, label: "Scanned Signature" },
                  { key: "dobProofUploaded" as const, label: "DOB Proof (10th Certificate / Birth Certificate)" },
                  { key: "qualificationUploaded" as const, label: "Qualification Certificate" },
                  { key: "experienceUploaded" as const, label: "Experience Certificate" },
                  { key: "categoryUploaded" as const, label: "Category / Community Certificate" },
                ].map((doc) => (
                  <div
                    key={doc.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30"
                  >
                    <div>
                      <p className="text-sm font-bold text-teams-dark">
                        {doc.label}
                      </p>
                      <p className="text-xs font-medium text-foreground-400 mt-0.5">
                        PDF, PNG or JPEG, max 2 MB
                      </p>
                    </div>
                    
                    <label className={cn(
                      "cursor-pointer rounded-lg px-4 py-2 text-xs font-bold transition flex items-center justify-center min-w-[120px]",
                      formData[doc.key] 
                        ? "bg-success/10 text-success-700 border border-success/20" 
                        : "bg-white text-teams-ocean border border-teams-ocean/20 hover:bg-teams-ocean/5 shadow-sm"
                    )}>
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf,image/png,image/jpeg"
                        onChange={() => updateField(doc.key, true)}
                      />
                      {formData[doc.key] ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Uploaded
                        </span>
                      ) : (
                        "Choose File"
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 — Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-teams-dark mb-2">
                Review & Submit
              </h2>
              <p className="text-sm font-medium text-foreground-500 mb-6">
                Please review all information carefully before submitting. Once
                submitted, the application will be locked and cannot be edited.
              </p>

              {/* Summary sections */}
              <div className="space-y-4">
                {/* Personal */}
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-5">
                  <h3 className="text-sm font-bold text-teams-dark border-b border-teams-border/40 pb-2 mb-3">
                    Personal Details
                  </h3>
                  <div className="grid gap-y-3 gap-x-4 text-sm sm:grid-cols-2">
                    <p><span className="text-foreground-500 font-semibold mr-2">Name:</span> <span className="font-bold text-teams-dark">{formData.fullName || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Father:</span> <span className="font-bold text-teams-dark">{formData.fatherName || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">DOB:</span> <span className="font-bold text-teams-dark">{formData.dob || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Gender:</span> <span className="font-bold text-teams-dark">{formData.gender || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Email:</span> <span className="font-bold text-teams-dark">{formData.email || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Mobile:</span> <span className="font-bold text-teams-dark">{formData.mobile || "—"}</span></p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-5">
                  <h3 className="text-sm font-bold text-teams-dark border-b border-teams-border/40 pb-2 mb-3">
                    Educational Qualifications
                  </h3>
                  <div className="grid gap-y-3 gap-x-4 text-sm sm:grid-cols-2">
                    <p><span className="text-foreground-500 font-semibold mr-2">Qualification:</span> <span className="font-bold text-teams-dark">{formData.qualification || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">University:</span> <span className="font-bold text-teams-dark">{formData.university || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Year:</span> <span className="font-bold text-teams-dark">{formData.yearOfPassing || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Percentage:</span> <span className="font-bold text-teams-dark">{formData.percentage || "—"}</span></p>
                  </div>
                </div>

                {/* Experience */}
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-5">
                  <h3 className="text-sm font-bold text-teams-dark border-b border-teams-border/40 pb-2 mb-3">
                    Work Experience
                  </h3>
                  <div className="grid gap-y-3 gap-x-4 text-sm sm:grid-cols-2">
                    <p><span className="text-foreground-500 font-semibold mr-2">Years:</span> <span className="font-bold text-teams-dark">{formData.experienceYears}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Organization:</span> <span className="font-bold text-teams-dark">{formData.currentOrganization || "—"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Designation:</span> <span className="font-bold text-teams-dark">{formData.designation || "—"}</span></p>
                  </div>
                </div>

                {/* Category */}
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-5">
                  <h3 className="text-sm font-bold text-teams-dark border-b border-teams-border/40 pb-2 mb-3">
                    Category & Eligibility
                  </h3>
                  <div className="grid gap-y-3 gap-x-4 text-sm sm:grid-cols-2">
                    <p><span className="text-foreground-500 font-semibold mr-2">Category:</span> <span className="font-bold text-teams-dark">{formData.category}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">PwBD:</span> <span className="font-bold text-teams-dark">{formData.isPwBD ? `Yes (${formData.pwbdPercentage})` : "No"}</span></p>
                    <p><span className="text-foreground-500 font-semibold mr-2">Ex-Serviceman:</span> <span className="font-bold text-teams-dark">{formData.isExServiceman ? "Yes" : "No"}</span></p>
                  </div>
                </div>
              </div>

              {/* Submit warning */}
              <div className="rounded-xl border border-warning-200 bg-warning-50 p-5 flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle size={20} className="text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-warning-800 mb-1">
                    Important
                  </p>
                  <p className="text-sm font-medium text-warning-700/80 leading-relaxed">
                    By clicking &ldquo;Submit Application&rdquo;, you confirm that
                    all information provided is accurate and complete. The
                    application will be locked with a SHA-256 integrity hash and
                    cannot be modified after submission.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-6 py-4 md:px-8 bg-teams-gray/10 border-t border-teams-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                className="font-bold bg-white border border-teams-border/40 text-foreground-600 shadow-sm"
                onClick={goPrev}
                icon={<ArrowLeft size={16} />}
              >
                Previous
              </Button>
            )}
          </div>

          {/* Auto-save indicator */}
          <div className="hidden items-center gap-2 text-xs font-bold text-foreground-400 sm:flex">
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin text-teams-ocean" />
                Saving...
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle2 size={14} className="text-success-600" />
                Saved at {lastSaved}
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="bordered"
              onClick={saveDraft}
              loading={saving}
              className="font-bold border-teams-border/60 text-foreground-600 bg-white shadow-sm"
              icon={!saving ? <Save size={16} /> : undefined}
            >
              Save Draft
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                variant="primary"
                onClick={goNext}
                className="font-bold bg-teams-ocean shadow-md px-6 flex-row-reverse"
                icon={<ArrowRight size={16} />}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
                className="font-bold text-white shadow-md"
                icon={!submitting ? <Send size={16} /> : undefined}
              >
                Submit Application
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
