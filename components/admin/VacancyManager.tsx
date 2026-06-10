"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  Save,
  ToggleLeft,
  ToggleRight,
  Users,
  Calendar,
} from "lucide-react";
import { ColourTag } from "./ColourTag";
import { cn } from "@/lib/utils";
import {
  createRecruitmentPost,
  updateRecruitmentPost,
  deleteRecruitmentPost,
} from "@/app/actions/vacancies";

/* ═══════════════════════════════════════════════════ */
/*  Types                                              */
/* ═══════════════════════════════════════════════════ */

type Vacancy = {
  id: string;
  category: string;
  vacancyCount: number;
  backlogCount: number;
  horizontalPwbdCount: number;
  remarks: string | null;
};

type Post = {
  id: string;
  postCode: string;
  title: string;
  advertisementNo: string;
  crucialDate: string;
  openingDate: string;
  closingDate: string;
  isActive: boolean;
  applicationCount: number;
  vacancies: Vacancy[];
};

const CATEGORIES = ["UR", "OBC", "SC", "ST", "EWS", "PwBD"];

/* ═══════════════════════════════════════════════════ */
/*  Component                                          */
/* ═══════════════════════════════════════════════════ */

export function VacancyManager({ posts }: { posts: Post[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      await createRecruitmentPost(formData);
      setShowCreate(false);
    });
  };

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      await updateRecruitmentPost(formData);
    });
  };

  const handleDelete = (postId: string) => {
    if (!confirm("Are you sure you want to delete this recruitment post?"))
      return;
    const fd = new FormData();
    fd.set("postId", postId);
    startTransition(async () => {
      try {
        await deleteRecruitmentPost(fd);
      } catch (err: unknown) {
        alert((err as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Create New Post Toggle ── */}
      <button
        onClick={() => setShowCreate(!showCreate)}
        className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 hover:bg-blue-800 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create New Recruitment Post
      </button>

      {/* ── Create Form ── */}
      {showCreate && (
        <form
          action={handleCreate}
          className="glass-card p-6 space-y-5 animate-fade-in-up"
        >
          <h3 className="heading-font text-lg font-bold text-blue-950">
            New Recruitment Post
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label label-required">Post Code</label>
              <input
                alt="postCode"
                required
                className="input"
                placeholder="e.g. TO-2026"
              />
            </div>
            <div>
              <label className="label label-required">Title</label>
              <input
                alt="title"
                required
                className="input"
                placeholder="e.g. Technical Officer"
              />
            </div>
            <div>
              <label className="label label-required">Advertisement No</label>
              <input
                alt="advertisementNo"
                required
                className="input"
                placeholder="e.g. ADV/SERC/01/2026"
              />
            </div>
            <div>
              <label className="label label-required">Crucial Date</label>
              <input alt="crucialDate" type="date" required className="input" />
            </div>
            <div>
              <label className="label label-required">Opening Date</label>
              <input alt="openingDate" type="date" required className="input" />
            </div>
            <div>
              <label className="label label-required">Closing Date</label>
              <input alt="closingDate" type="date" required className="input" />
            </div>
          </div>

          {/* Vacancy Matrix */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-700">
              Category-wise Vacancy Allocation
            </h4>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Vacancies</th>
                    <th>Backlog</th>
                    <th>PwBD (Horizontal)</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat) => (
                    <tr key={cat}>
                      <td>
                        <ColourTag value={cat} />
                      </td>
                      <td>
                        <input
                          alt={`vacancy_${cat}`}
                          type="number"
                          min={0}
                          defaultValue={0}
                          className="input !w-20 !py-1 !text-center"
                        />
                      </td>
                      <td>
                        <input
                          alt={`backlog_${cat}`}
                          type="number"
                          min={0}
                          defaultValue={0}
                          className="input !w-20 !py-1 !text-center"
                        />
                      </td>
                      <td>
                        <input
                          alt={`pwbd_${cat}`}
                          type="number"
                          min={0}
                          defaultValue={0}
                          className="input !w-20 !py-1 !text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Creating..." : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Posts List ── */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-card overflow-hidden">
            {/* Post Header */}
            <button
              onClick={() => toggleExpand(post.id)}
              className="flex w-full items-center gap-4 p-5 text-left hover:bg-white/30 transition-colors"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  post.isActive ? "bg-green-50" : "bg-slate-100"
                )}
              >
                {post.isActive ? (
                  <ToggleRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="heading-font text-sm font-bold text-blue-950">
                    {post.title}
                  </h3>
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    {post.postCode}
                  </span>
                  {!post.isActive && (
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      INACTIVE
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Advt. {post.advertisementNo} · Closing:{" "}
                  {new Date(post.closingDate).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-bold">{post.applicationCount}</span>
                    <span>apps</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {post.vacancies.reduce(
                      (sum, v) => sum + v.vacancyCount,
                      0
                    )}{" "}
                    total vacancies
                  </p>
                </div>
                {expandedId === post.id ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === post.id && (
              <div className="border-t border-slate-100 animate-fade-in-up">
                <form action={handleUpdate} className="p-5 space-y-5">
                  <input type="hidden" alt="postId" value={post.id} />

                  {/* Editable fields */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="label">Title</label>
                      <input
                        alt="title"
                        defaultValue={post.title}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Advertisement No</label>
                      <input
                        alt="advertisementNo"
                        defaultValue={post.advertisementNo}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Crucial Date</label>
                      <input
                        alt="crucialDate"
                        type="date"
                        defaultValue={post.crucialDate.slice(0, 10)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Closing Date</label>
                      <input
                        alt="closingDate"
                        type="date"
                        defaultValue={post.closingDate.slice(0, 10)}
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-slate-700">
                      Active
                    </label>
                    <select
                      name="isActive"
                      defaultValue={String(post.isActive)}
                      className="input !w-auto !py-1.5 !text-sm"
                    >
                      <option value="true">Yes – Active</option>
                      <option value="false">No – Inactive</option>
                    </select>
                  </div>

                  {/* Vacancy Allocation Table */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-slate-700">
                      Category Vacancy Allocation
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Vacancies</th>
                            <th>Backlog</th>
                            <th>PwBD (H)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CATEGORIES.map((cat) => {
                            const vac = post.vacancies.find(
                              (v) => v.category === cat
                            );
                            return (
                              <tr key={cat}>
                                <td>
                                  <ColourTag value={cat} />
                                </td>
                                <td>
                                  <input
                                    alt={`vacancy_${cat}`}
                                    type="number"
                                    min={0}
                                    defaultValue={vac?.vacancyCount ?? 0}
                                    className="input !w-20 !py-1 !text-center"
                                  />
                                </td>
                                <td>
                                  <input
                                    alt={`backlog_${cat}`}
                                    type="number"
                                    min={0}
                                    defaultValue={vac?.backlogCount ?? 0}
                                    className="input !w-20 !py-1 !text-center"
                                  />
                                </td>
                                <td>
                                  <input
                                    alt={`pwbd_${cat}`}
                                    type="number"
                                    min={0}
                                    defaultValue={vac?.horizontalPwbdCount ?? 0}
                                    className="input !w-20 !py-1 !text-center"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      {isPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={isPending || post.applicationCount > 0}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                      title={
                        post.applicationCount > 0
                          ? "Cannot delete post with applications"
                          : "Delete this post"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-400">
              No recruitment posts created yet
            </p>
            <p className="text-xs text-slate-400">
              Click &ldquo;Create New Recruitment Post&rdquo; to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
