import { redirect } from "next/navigation";

/**
 * Legacy application page redirects to the new applicant portal.
 * Application flow now starts from /applicant/apply
 */
export default function LegacyApplicationRedirect() {
  redirect("/applicant/apply");
}
