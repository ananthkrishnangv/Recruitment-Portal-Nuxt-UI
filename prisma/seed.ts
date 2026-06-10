import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding CSIR-SERC Recruitment Portal...\n");

  // ════════════════════════════════════════════
  // 1. Recruitment Posts
  // ════════════════════════════════════════════
  console.log("  ▸ Creating recruitment posts...");

  const post1 = await prisma.recruitmentPost.upsert({
    where: { postCode: "TO-2026" },
    update: {
      categoryMatrix: { UR: 2, OBC: 2, SC: 1, ST: 1, EWS: 1, PwBD: 1 },
      eligibilityRule: {
        maxAge: 35,
        essentialQualification: "BE/BTech or equivalent in Civil/Structural Engineering",
        minimumExperienceYears: 3,
      },
    },
    create: {
      postCode: "TO-2026",
      title: "Technical Officer (Civil Engineering)",
      advertisementNo: "CSIR-SERC/RECT/2026/01",
      crucialDate: new Date("2026-06-30"),
      openingDate: new Date("2026-06-01"),
      closingDate: new Date("2026-07-15"),
      categoryMatrix: { UR: 2, OBC: 2, SC: 1, ST: 1, EWS: 1, PwBD: 1 },
      eligibilityRule: {
        maxAge: 35,
        essentialQualification: "BE/BTech or equivalent in Civil/Structural Engineering",
        minimumExperienceYears: 3,
      },
      feeRule: { UR: 500, OBC: 500, EWS: 500, SC: 0, ST: 0, PwBD: 0 },
    },
  });

  const post2 = await prisma.recruitmentPost.upsert({
    where: { postCode: "SRF-2026" },
    update: {},
    create: {
      postCode: "SRF-2026",
      title: "Senior Research Fellow (Structural Dynamics)",
      advertisementNo: "CSIR-SERC/RECT/2026/02",
      crucialDate: new Date("2026-07-31"),
      openingDate: new Date("2026-06-10"),
      closingDate: new Date("2026-08-10"),
      categoryMatrix: { UR: 3, OBC: 1, SC: 1, ST: 0, EWS: 1, PwBD: 0 },
      eligibilityRule: {
        maxAge: 32,
        essentialQualification: "ME/MTech in Structural Engineering with NET/GATE",
        minimumExperienceYears: 0,
      },
      feeRule: { UR: 0, OBC: 0, EWS: 0, SC: 0, ST: 0, PwBD: 0 },
    },
  });

  const post3 = await prisma.recruitmentPost.upsert({
    where: { postCode: "TA-2026" },
    update: {},
    create: {
      postCode: "TA-2026",
      title: "Technical Assistant (Lab Technician Grade-II)",
      advertisementNo: "CSIR-SERC/RECT/2026/03",
      crucialDate: new Date("2026-05-31"),
      openingDate: new Date("2026-04-15"),
      closingDate: new Date("2026-05-31"),
      categoryMatrix: { UR: 1, OBC: 1, SC: 1, ST: 0, EWS: 0, PwBD: 0 },
      eligibilityRule: {
        maxAge: 28,
        essentialQualification: "Diploma in Civil/Mechanical Engineering",
        minimumExperienceYears: 2,
      },
      feeRule: { UR: 300, OBC: 300, EWS: 300, SC: 0, ST: 0, PwBD: 0 },
      isActive: false,
    },
  });

  // Vacancy allocations for all posts
  const vacancyData: [string, string, number, number, number, string][] = [
    // Post 1
    [post1.id, "UR", 2, 0, 0, "General category"],
    [post1.id, "OBC", 2, 0, 0, "Non-Creamy Layer only"],
    [post1.id, "SC", 1, 0, 0, "Scheduled Caste"],
    [post1.id, "ST", 1, 0, 0, "Scheduled Tribe"],
    [post1.id, "EWS", 1, 0, 0, "Economically Weaker Section"],
    [post1.id, "PwBD", 1, 0, 1, "Horizontal PwBD reservation"],
    // Post 2
    [post2.id, "UR", 3, 0, 0, "General category"],
    [post2.id, "OBC", 1, 0, 0, "Non-Creamy Layer only"],
    [post2.id, "SC", 1, 0, 0, "Scheduled Caste"],
    [post2.id, "EWS", 1, 0, 0, "Economically Weaker Section"],
    // Post 3
    [post3.id, "UR", 1, 0, 0, "General category"],
    [post3.id, "OBC", 1, 0, 0, "Non-Creamy Layer only"],
    [post3.id, "SC", 1, 1, 0, "SC with 1 backlog vacancy"],
  ];

  for (const [postId, category, vacancyCount, backlogCount, horizontalPwbdCount, remarks] of vacancyData) {
    await prisma.postCategoryVacancy.upsert({
      where: { postId_category: { postId, category } },
      update: { vacancyCount, backlogCount, horizontalPwbdCount, remarks },
      create: { postId, category, vacancyCount, backlogCount, horizontalPwbdCount, remarks },
    });
  }

  // ════════════════════════════════════════════
  // 2. Users
  // ════════════════════════════════════════════
  console.log("  ▸ Creating users...");

  const admin = await prisma.user.upsert({
    where: { mobile: "9000000000" },
    update: {},
    create: { mobile: "9000000000", name: "Dr. S. Ramanathan", role: "ADMIN" },
  });

  const applicants = [
    { mobile: "9876543210", name: "Anita Raman", category: "UR", dob: "1993-05-10", aadhaar: "1234" },
    { mobile: "9876543211", name: "Rahul Menon", category: "OBC", dob: "1991-02-12", aadhaar: "5678" },
    { mobile: "9876543212", name: "Farida Khan", category: "EWS", dob: "1995-09-20", aadhaar: "9012" },
    { mobile: "9876543213", name: "S. Karthik", category: "SC", dob: "1990-11-05", aadhaar: "3456" },
    { mobile: "9876543214", name: "Priya Subramanian", category: "UR", dob: "1994-08-15", aadhaar: "7890" },
    { mobile: "9876543215", name: "Mohammed Irfan", category: "OBC", dob: "1992-12-01", aadhaar: "2345" },
    { mobile: "9876543216", name: "Deepika Lakshmi", category: "ST", dob: "1996-03-22", aadhaar: "6789" },
    { mobile: "9876543217", name: "Rajesh Kumar", category: "EWS", dob: "1993-07-18", aadhaar: "0123" },
    { mobile: "9876543218", name: "Kavitha Nair", category: "UR", dob: "1994-01-30", aadhaar: "4567" },
    { mobile: "9876543219", name: "Arun Prasad", category: "OBC", dob: "1990-06-25", aadhaar: "8901" },
    { mobile: "9876543220", name: "Lakshmi Devi", category: "SC", dob: "1995-11-11", aadhaar: "2346" },
    { mobile: "9876543221", name: "Suresh Babu", category: "PwBD", dob: "1991-09-05", aadhaar: "5679" },
  ] as const;

  const statuses = [
    "UNDER_SCRUTINY",
    "DEFICIENCY_RAISED",
    "RECOMMENDED",
    "PAYMENT_SUCCESS",
    "SUBMITTED",
    "UNDER_SCRUTINY",
    "DRAFT",
    "DIRECTOR_APPROVED",
    "SUBMITTED",
    "RECOMMENDED",
    "REJECTED",
    "UNDER_SCRUTINY",
  ] as const;

  const userRecords = [];
  for (let i = 0; i < applicants.length; i++) {
    const a = applicants[i];
    const user = await prisma.user.upsert({
      where: { mobile: a.mobile },
      update: {},
      create: {
        mobile: a.mobile,
        name: a.name,
        email: `${a.name.toLowerCase().replace(/[^a-z]/g, ".")}@example.com`,
        role: "APPLICANT",
        aadhaarLast4: a.aadhaar,
        consentVersion: "DPDP-v1",
        consentAt: new Date(Date.now() - Math.random() * 15 * 86400000),
      },
    });
    userRecords.push(user);
  }

  // ════════════════════════════════════════════
  // 3. Applications
  // ════════════════════════════════════════════
  console.log("  ▸ Creating applications...");

  for (let i = 0; i < userRecords.length; i++) {
    const user = userRecords[i];
    const a = applicants[i];
    const status = statuses[i];
    const postId = i < 8 ? post1.id : i < 10 ? post2.id : post3.id;
    const appNo = `APP-20260602-${String(i + 1).padStart(4, "0")}`;
    const daysAgo = Math.floor(Math.random() * 20 + 1);

    await prisma.application.upsert({
      where: { applicationNo: appNo },
      update: {},
      create: {
        applicationNo: appNo,
        applicantId: user.id,
        postId,
        status: status as any,
        category: a.category,
        dob: new Date(a.dob),
        formData: {
          qualification: ["BE Civil", "BTech Structural", "ME Civil", "Diploma Civil", "BTech Mechanical"][i % 5],
          experienceYears: 2 + (i % 8),
          fatherName: `Shri ${a.name.split(" ").pop()} Sr.`,
          gender: i % 3 === 0 ? "Female" : "Male",
          address: `${100 + i}, Demo Nagar, Chennai-600${10 + i}`,
        },
        eligibilityResult: {
          eligible: status !== "REJECTED",
          ruleVersion: "DEMO-DOPT-CSIR-v2",
          ageCheck: true,
          qualificationCheck: true,
        },
        validationResult: {
          valid: true,
          vacancyCategoryAvailable: true,
          requiredDocuments: ["Photo", "Signature", "DOB Proof", "Community Certificate"],
        },
        paymentStatus: status === "DRAFT" ? null : "Success",
        submittedAt: status === "DRAFT" ? null : new Date(Date.now() - daysAgo * 86400000),
        lockedAt: status === "DRAFT" ? null : new Date(Date.now() - daysAgo * 86400000),
      },
    });
  }

  // ════════════════════════════════════════════
  // 4. Scrutiny Actions (for timeline display)
  // ════════════════════════════════════════════
  console.log("  ▸ Creating scrutiny actions...");

  const appsForScrutiny = await prisma.application.findMany({
    where: { status: { in: ["UNDER_SCRUTINY", "DEFICIENCY_RAISED", "RECOMMENDED", "REJECTED", "DIRECTOR_APPROVED"] } },
  });

  for (const app of appsForScrutiny) {
    await prisma.scrutinyAction.upsert({
      where: { id: `seed-scrutiny-${app.id}` },
      update: {},
      create: {
        id: `seed-scrutiny-${app.id}`,
        applicationId: app.id,
        actorId: admin.id,
        fromStatus: "SUBMITTED",
        toStatus: app.status,
        remarks: `Initial scrutiny review completed. ${
          app.status === "DEFICIENCY_RAISED"
            ? "Missing community certificate. Please upload within 7 days."
            : app.status === "RECOMMENDED"
            ? "All documents verified. Eligibility confirmed."
            : app.status === "REJECTED"
            ? "Over-age as per crucial date. Not eligible."
            : "Under review."
        }`,
      },
    });
  }

  // ════════════════════════════════════════════
  // 5. Payments (for analytics)
  // ════════════════════════════════════════════
  console.log("  ▸ Creating payment records...");

  const paidApps = await prisma.application.findMany({
    where: { paymentStatus: "Success" },
  });

  for (let i = 0; i < paidApps.length; i++) {
    const app = paidApps[i];
    const amount = ["SC", "ST", "PwBD"].includes(app.category) ? 0 : 500;

    await prisma.payment.upsert({
      where: { gatewayRef: `SBI-PAY-${app.applicationNo}` },
      update: {},
      create: {
        applicationId: app.id,
        gatewayRef: `SBI-PAY-${app.applicationNo}`,
        amount: amount,
        status: "Success",
        idempotencyKey: `IDEM-${app.applicationNo}`,
        paidAt: app.submittedAt ?? new Date(),
        webhookPayload: {
          gateway: "SBI Collect (Demo)",
          txnId: `SBI${Date.now()}${i}`,
          mode: "NetBanking",
        },
      },
    });
  }

  // ════════════════════════════════════════════
  // 6. Consent Notice
  // ════════════════════════════════════════════
  console.log("  ▸ Creating consent notice...");

  await prisma.consentNotice.upsert({
    where: { version: "DPDP-v1" },
    update: { active: true },
    create: {
      version: "DPDP-v1",
      title: "Consent Notice — CSIR-SERC Recruitment Portal",
      language: "en",
      active: true,
      body: `Your personal data will be processed for the following purposes under the Digital Personal Data Protection Act, 2023:

1. Recruitment application processing and eligibility validation
2. Payment processing and reconciliation via authorized gateways
3. Application scrutiny, document verification, and status communication
4. Audit trail maintenance and regulatory compliance (DoPT/CSIR/CERT-In)
5. Grievance redressal and legal/records compliance

Aadhaar, if provided, is used only as a local identifier. No live UIDAI authentication shall be performed. Your data will be retained as per CCS (Pension) Rules and CSIR record retention schedule.

You have the right to withdraw consent, request correction, and request erasure (subject to legal retention requirements). Contact the recruitment helpdesk for data-related queries.`,
    },
  });

  // ════════════════════════════════════════════
  // 7. Site Settings
  // ════════════════════════════════════════════
  console.log("  ▸ Creating site settings...");

  const settings: [string, unknown, boolean][] = [
    ["portal.title", "CSIR-SERC Recruitment Portal", false],
    ["portal.helpdeskEmail", "recruitment-helpdesk@serc.res.in", false],
    ["portal.helpdeskPhone", "+91-44-2254-9201", false],
    ["portal.maintenanceMode", false, false],
    ["portal.publicNotice", "", false],
    ["notification.smtp.host", "", true],
    ["notification.smtp.port", "587", false],
    ["notification.smtp.fromEmail", "noreply@serc.res.in", false],
    ["notification.smtp.tls", true, false],
    ["notification.whatsapp.enabled", false, false],
    ["notification.whatsapp.provider", "", false],
    ["notification.whatsapp.apiEndpoint", "", true],
    ["notification.whatsapp.templateApplicationSubmitted", "", false],
    ["notification.whatsapp.consentRequired", true, false],
    ["notification.telegram.enabled", false, false],
    ["notification.telegram.botToken", "", true],
    ["notification.telegram.chatId", "", false],
    ["notification.telegram.adminOnly", true, false],
    ["security.certin.incidentReportingHours", 6, false],
    ["security.certin.logRetentionDays", 180, false],
    ["security.otpExpiryMinutes", 10, false],
    ["security.maxUploadMb", 5, false],
    ["security.sessionTimeoutMinutes", 30, false],
    ["security.maxLoginAttempts", 5, false],
  ];

  for (const [key, value, isSecret] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: value as any, isSecret },
      create: { key, value: value as any, isSecret, updatedBy: admin.id },
    });
  }

  // ════════════════════════════════════════════
  // 8. Security Controls
  // ════════════════════════════════════════════
  console.log("  ▸ Creating security controls...");

  const controls: [string, string, string][] = [
    ["CERTIN-LOG-180", "Audit/security log retention ≥180 days", "CERT-In Directions 2022"],
    ["CERTIN-INC-6H", "Cyber incident reporting within 6 hours", "CERT-In Directions 2022"],
    ["CERTIN-AUDIT", "CERT-In empanelled audit evidence tracker", "CERT-In Directions 2022"],
    ["CERTIN-SYNC", "NTP time synchronization for all servers", "CERT-In Directions 2022"],
    ["DPDP-NOTICE", "Consent notice before personal data processing", "DPDP Act 2023"],
    ["DPDP-ERASURE", "Data correction and erasure request workflow", "DPDP Act 2023"],
    ["DPDP-BREACH", "Data breach notification to Board/Data Principal", "DPDP Act 2023"],
    ["DOPT-RES", "SC/ST/OBC/EWS/PwBD vacancy category validation", "DoPT/CSIR Rules"],
    ["DOPT-AGE", "Age relaxation and crucial date validation engine", "DoPT/CSIR Rules"],
    ["GIGW-3", "GIGW 3.0 accessibility compliance", "GIGW Guidelines"],
    ["WCAG-AA", "WCAG 2.1 Level AA accessibility", "W3C/GIGW"],
  ];

  for (const [controlCode, controlName, framework] of controls) {
    await prisma.securityControlCheck.upsert({
      where: { controlCode },
      update: {},
      create: { controlCode, controlName, framework, status: "IMPLEMENTED_DEMO" },
    });
  }

  // ════════════════════════════════════════════
  // 9. Initial Audit Log
  // ════════════════════════════════════════════
  console.log("  ▸ Creating initial audit log entry...");

  const crypto = await import("node:crypto");
  const payload = JSON.stringify({
    actorId: admin.id,
    action: "SYSTEM_SEED",
    entityType: "System",
    entityId: "seed",
    beforeJson: null,
    afterJson: { seedVersion: "v2.0", timestamp: new Date().toISOString() },
    previousHash: null,
  });
  const currentHash = crypto.createHash("sha256").update(payload).digest("hex");

  await prisma.auditLog.upsert({
    where: { id: "seed-audit-genesis" },
    update: {},
    create: {
      id: "seed-audit-genesis",
      actorId: admin.id,
      action: "SYSTEM_SEED",
      entityType: "System",
      entityId: "seed",
      afterJson: { seedVersion: "v2.0", timestamp: new Date().toISOString() },
      previousHash: null,
      currentHash,
    },
  });

  console.log("\n✅ Seed complete!");
  console.log(`   Posts: ${[post1, post2, post3].length}`);
  console.log(`   Users: ${userRecords.length + 1} (1 admin + ${userRecords.length} applicants)`);
  console.log(`   Applications: ${userRecords.length}`);
  console.log(`   Settings: ${settings.length}`);
  console.log(`   Security Controls: ${controls.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
