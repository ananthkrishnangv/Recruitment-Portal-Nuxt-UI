import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import ApplicationWizard from "@/components/applicant/ApplicationWizard";

export default async function ApplyForPostPage({
  params,
}: {
  params: Promise<{ postCode: string }>;
}) {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  const { postCode } = await params;

  const post = await prisma.recruitmentPost.findUnique({
    where: { postCode },
  });

  if (!post || !post.isActive) notFound();

  return (
    <ApplicationWizard
      postCode={post.postCode}
      postTitle={post.title}
      advertisementNo={post.advertisementNo}
    />
  );
}
