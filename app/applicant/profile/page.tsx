import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getApplicantUser } from "@/lib/auth/session";
import { maskAadhaar, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, Input, Select, SelectItem, Checkbox } from "@/components/ui/heroui";
import { User, Shield, Mail, Phone, Save, Calendar, Tags, CheckCircle2 } from "lucide-react";

export default async function ProfilePage() {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <section className="glass-card p-6 bg-teams-gray/20 border border-teams-border/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10">
            <User size={24} className="text-teams-ocean" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teams-dark">
              Profile
            </h1>
            <p className="mt-1 text-sm font-medium text-foreground-500">
              Manage your personal information and preferences.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                Personal Information
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <form className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <Input
                    alt="name"
                    label="Full Name"
                    defaultValue={user.name}
                    placeholder="Enter your full name"
                    variant="bordered"
                    labelPlacement="outside"
                    isRequired
                    startContent={<User size={16} className="text-foreground-400" />}
                    classNames={{ inputWrapper: "bg-white border-teams-border/60" }}
                  />

                  {/* Mobile (read-only) */}
                  <Input
                    label="Mobile Number"
                    value={user.mobile ?? "Not provided"}
                    variant="ghost"
                    labelPlacement="outside"
                    isReadOnly
                    isDisabled
                    startContent={<Phone size={16} className="text-foreground-400" />}
                    description="Mobile number cannot be changed after registration."
                    classNames={{ 
                      inputWrapper: "bg-teams-gray/30 border-teams-border/40",
                      description: "text-[10px] text-foreground-400 font-semibold"
                    }}
                  />

                  {/* Email */}
                  <Input
                    alt="email"
                    type="email"
                    label="Email Address"
                    defaultValue={user.email ?? ""}
                    placeholder="you@example.com"
                    variant="bordered"
                    labelPlacement="outside"
                    startContent={<Mail size={16} className="text-foreground-400" />}
                    classNames={{ inputWrapper: "bg-white border-teams-border/60" }}
                  />

                  {/* Date of Birth */}
                  <Input
                    alt="dob"
                    type="date"
                    label="Date of Birth"
                    variant="bordered"
                    labelPlacement="outside"
                    startContent={<Calendar size={16} className="text-foreground-400" />}
                    classNames={{ inputWrapper: "bg-white border-teams-border/60" }}
                  />

                  {/* Gender */}
                  <Select
                    name="gender"
                    label="Gender"
                    placeholder="Select gender"
                    variant="bordered"
                    labelPlacement="outside"
                    startContent={<User size={16} className="text-foreground-400" />}
                    classNames={{ trigger: "bg-white border-teams-border/60" }}
                  >
                    <SelectItem id="Male" textValue="Male">Male</SelectItem>
                    <SelectItem id="Female" textValue="Female">Female</SelectItem>
                    <SelectItem id="Transgender" textValue="Transgender">Transgender</SelectItem>
                  </Select>

                  {/* Category */}
                  <Select
                    name="category"
                    label="Category"
                    defaultSelectedKeys={["UR"]}
                    variant="bordered"
                    labelPlacement="outside"
                    startContent={<Tags size={16} className="text-foreground-400" />}
                    classNames={{ trigger: "bg-white border-teams-border/60" }}
                  >
                    <SelectItem id="UR" textValue="Unreserved (UR)">Unreserved (UR)</SelectItem>
                    <SelectItem id="OBC" textValue="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</SelectItem>
                    <SelectItem id="SC" textValue="SC">SC</SelectItem>
                    <SelectItem id="ST" textValue="ST">ST</SelectItem>
                    <SelectItem id="EWS" textValue="EWS">EWS</SelectItem>
                  </Select>
                </div>

                {/* Save button */}
                <div className="pt-4 flex justify-end border-t border-teams-border/30">
                  <Button
                    type="submit"
                    variant="primary"
                    className="font-bold bg-teams-ocean shadow-md px-6"
                    icon={<Save size={18} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Aadhaar Display */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="flex items-center gap-2 p-6 pb-2">
              <Shield size={20} className="text-teams-ocean" />
              <h2 className="text-xl font-bold text-teams-dark">
                Identity Verification
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-500">
                    Aadhaar (Masked)
                  </p>
                  <p className="mt-2 font-mono text-xl font-bold text-teams-dark tracking-widest">
                    {maskAadhaar(user.aadhaarLast4)}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-foreground-400 leading-relaxed">
                    Local-only, not authenticated with UIDAI as per DPDP compliance.
                  </p>
                </div>

                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-500">
                    Consent Status
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {user.consentVersion ? (
                      <CheckCircle2 size={18} className="text-success-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-foreground-300" />
                    )}
                    <p className={`text-sm font-bold ${user.consentVersion ? "text-success-700" : "text-foreground-500"}`}>
                      {user.consentVersion
                        ? `Accepted — v${user.consentVersion}`
                        : "Not yet provided"}
                    </p>
                  </div>
                  {user.consentAt && (
                    <p className="mt-2 text-[10px] font-semibold text-foreground-400">
                      Consented on: {formatDate(user.consentAt)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                Preferences
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="space-y-3">
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30">
                  <Checkbox defaultSelected  classNames={{ label: "text-sm font-bold text-teams-dark ml-1" }}>
                    Email Notifications
                  </Checkbox>
                  <p className="text-xs font-medium text-foreground-500 mt-1 pl-8">
                    Receive updates about application status changes and results.
                  </p>
                </div>

                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30">
                  <Checkbox defaultSelected  classNames={{ label: "text-sm font-bold text-teams-dark ml-1" }}>
                    SMS Notifications
                  </Checkbox>
                  <p className="text-xs font-medium text-foreground-500 mt-1 pl-8">
                    Receive critical alerts on your registered mobile number.
                  </p>
                </div>

                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30">
                  <Checkbox  classNames={{ label: "text-sm font-bold text-teams-dark ml-1" }}>
                    WhatsApp Updates
                  </Checkbox>
                  <p className="text-xs font-medium text-foreground-500 mt-1 pl-8">
                    Get application updates on WhatsApp (if configured).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card  className="border border-teams-border/40 bg-teams-gray/10">
            <CardContent className="p-5">
              <div className="space-y-3 text-xs font-medium text-foreground-500">
                <div className="flex justify-between">
                  <span>Account Created:</span>
                  <span className="font-bold text-teams-dark">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-bold text-teams-dark">{formatDate(user.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-bold text-teams-dark">{user.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

