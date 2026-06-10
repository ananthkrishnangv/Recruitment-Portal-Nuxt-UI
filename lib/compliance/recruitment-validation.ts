import { prisma } from "@/lib/db/prisma";
import { checkEligibility, type Category } from "./dopt-rules";

export async function validateRecruitmentApplication(input: {
  postCode: string;
  category: Category;
  dob: Date;
  qualification: string;
  experienceYears: number;
}) {
  const post = await prisma.recruitmentPost.findUnique({ where: { postCode: input.postCode }, include: { vacancies: true } });
  if (!post) return { valid: false, errors: ["Recruitment post not found"], warnings: [] };

  const errors: string[] = [];
  const warnings: string[] = [];
  const rule = post.eligibilityRule as any;
  const ageResult = checkEligibility({ dob: input.dob, category: input.category, maxAge: rule.maxAge ?? 35, crucialDate: post.crucialDate });
  const vacancy = post.vacancies.find(v => v.category === input.category);

  if (!ageResult.eligible) errors.push(`Age ${ageResult.age} exceeds allowed maximum ${ageResult.maxAge} for ${input.category}`);
  if (!vacancy || vacancy.vacancyCount <= 0) errors.push(`No vacancy configured for category ${input.category}`);
  if (!input.qualification || input.qualification.length < 2) errors.push("Qualification is required");
  if (Number(input.experienceYears) < Number(rule.minimumExperienceYears ?? 0)) errors.push(`Minimum experience required is ${rule.minimumExperienceYears} years`);
  if (new Date() > post.closingDate) warnings.push("Application window is closed as per configured closing date");

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    ageResult,
    vacancy: vacancy ? { category: vacancy.category, vacancyCount: vacancy.vacancyCount, backlogCount: vacancy.backlogCount, horizontalPwbdCount: vacancy.horizontalPwbdCount } : null,
    ruleVersion: "DEMO-DOPT-CSIR-v2"
  };
}
