export type Category = "UR" | "OBC" | "SC" | "ST" | "EWS" | "PwBD";
export function calculateAgeOnCrucialDate(dob: Date, crucialDate: Date) {
  let age = crucialDate.getFullYear() - dob.getFullYear();
  const m = crucialDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && crucialDate.getDate() < dob.getDate())) age--;
  return age;
}
export function checkEligibility({ dob, category, maxAge = 35, crucialDate }: { dob: Date; category: Category; maxAge?: number; crucialDate: Date }) {
  const relaxations: Record<Category, number> = { UR: 0, EWS: 0, OBC: 3, SC: 5, ST: 5, PwBD: 10 };
  const age = calculateAgeOnCrucialDate(dob, crucialDate);
  const relaxedMaxAge = Math.min(maxAge + (relaxations[category] ?? 0), 56);
  return { age, maxAge: relaxedMaxAge, eligible: age <= relaxedMaxAge, ruleVersion: "DEMO-DOPT-CSIR-v1" };
}
