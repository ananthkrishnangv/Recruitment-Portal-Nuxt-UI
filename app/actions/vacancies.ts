"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function createRecruitmentPost(formData: FormData) {
  await requireAdmin();

  const postCode = String(formData.get("postCode") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const advertisementNo = String(formData.get("advertisementNo") ?? "").trim();
  const crucialDate = new Date(String(formData.get("crucialDate") ?? ""));
  const openingDate = new Date(String(formData.get("openingDate") ?? ""));
  const closingDate = new Date(String(formData.get("closingDate") ?? ""));

  if (!postCode || !title || !advertisementNo) {
    throw new Error("Post code, title, and advertisement number are required");
  }

  const categories = ["UR", "OBC", "SC", "ST", "EWS", "PwBD"];
  const vacancies: Array<{
    category: string;
    vacancyCount: number;
    backlogCount: number;
    horizontalPwbdCount: number;
  }> = [];

  for (const cat of categories) {
    const count = Number(formData.get(`vacancy_${cat}`) ?? 0);
    const backlog = Number(formData.get(`backlog_${cat}`) ?? 0);
    const pwbd = Number(formData.get(`pwbd_${cat}`) ?? 0);
    if (count > 0 || backlog > 0) {
      vacancies.push({
        category: cat,
        vacancyCount: count,
        backlogCount: backlog,
        horizontalPwbdCount: pwbd,
      });
    }
  }

  const categoryMatrix = Object.fromEntries(
    vacancies.map((v) => [v.category, v.vacancyCount])
  );

  const post = await prisma.recruitmentPost.create({
    data: {
      postCode,
      title,
      advertisementNo,
      crucialDate,
      openingDate,
      closingDate,
      categoryMatrix,
      eligibilityRule: {},
      feeRule: {},
      vacancies: {
        create: vacancies,
      },
    },
  });

  await writeAuditLog({
    action: "RECRUITMENT_POST_CREATED",
    entityType: "RecruitmentPost",
    entityId: post.id,
    afterJson: { postCode, title, advertisementNo },
  });

  revalidatePath("/admin/vacancies");
}

export async function updateRecruitmentPost(formData: FormData) {
  await requireAdmin();

  const postId = String(formData.get("postId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const advertisementNo = String(formData.get("advertisementNo") ?? "").trim();
  const isActive = formData.get("isActive") === "true";
  const crucialDate = formData.get("crucialDate")
    ? new Date(String(formData.get("crucialDate")))
    : undefined;
  const closingDate = formData.get("closingDate")
    ? new Date(String(formData.get("closingDate")))
    : undefined;

  if (!postId) throw new Error("Post ID required");

  const before = await prisma.recruitmentPost.findUniqueOrThrow({
    where: { id: postId },
  });

  const after = await prisma.recruitmentPost.update({
    where: { id: postId },
    data: {
      ...(title && { title }),
      ...(advertisementNo && { advertisementNo }),
      ...(crucialDate && { crucialDate }),
      ...(closingDate && { closingDate }),
      isActive,
    },
  });

  const categories = ["UR", "OBC", "SC", "ST", "EWS", "PwBD"];
  for (const cat of categories) {
    const count = formData.get(`vacancy_${cat}`);
    if (count !== null) {
      await prisma.postCategoryVacancy.upsert({
        where: {
          postId_category: { postId, category: cat },
        },
        update: {
          vacancyCount: Number(count),
          backlogCount: Number(formData.get(`backlog_${cat}`) ?? 0),
          horizontalPwbdCount: Number(formData.get(`pwbd_${cat}`) ?? 0),
        },
        create: {
          postId,
          category: cat,
          vacancyCount: Number(count),
          backlogCount: Number(formData.get(`backlog_${cat}`) ?? 0),
          horizontalPwbdCount: Number(formData.get(`pwbd_${cat}`) ?? 0),
        },
      });
    }
  }

  await writeAuditLog({
    action: "RECRUITMENT_POST_UPDATED",
    entityType: "RecruitmentPost",
    entityId: postId,
    beforeJson: before,
    afterJson: after,
  });

  revalidatePath("/admin/vacancies");
}

export async function deleteRecruitmentPost(formData: FormData) {
  await requireAdmin();

  const postId = String(formData.get("postId") ?? "");
  if (!postId) throw new Error("Post ID required");

  const post = await prisma.recruitmentPost.findUniqueOrThrow({
    where: { id: postId },
    include: { _count: { select: { applications: true } } },
  });

  if (post._count.applications > 0) {
    throw new Error(
      "Cannot delete a post with existing applications. Deactivate it instead."
    );
  }

  await prisma.postCategoryVacancy.deleteMany({ where: { postId } });
  await prisma.recruitmentPost.delete({ where: { id: postId } });

  await writeAuditLog({
    action: "RECRUITMENT_POST_DELETED",
    entityType: "RecruitmentPost",
    entityId: postId,
    beforeJson: post,
  });

  revalidatePath("/admin/vacancies");
}
