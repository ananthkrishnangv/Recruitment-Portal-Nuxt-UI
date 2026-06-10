"use client";
import { Button } from "@/components/ui/button";

import { useMemo, useState, useCallback } from "react";
import {
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  ClipboardCheck,
  FileDown,
  MoreHorizontal,
  Rows3,
  Rows4,
  X,
  CheckSquare,
} from "lucide-react";
import { ColourTag } from "./ColourTag";
import { cn } from "@/lib/utils";
import { Input, Select, SelectItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Checkbox, Pagination, Card, CardContent, Tabs, Tab } from "@/components/ui/heroui";

/* ═══════════════════════════════════════════════════ */
/*  Types                                              */
/* ═══════════════════════════════════════════════════ */

type Row = {
  id: string;
  applicationNo: string;
  applicant: { name: string };
  post: { title: string };
  category: string;
  status: string;
  paymentStatus: string | null;
  submittedAt: string | null;
};

type SortKey = "applicationNo" | "applicant" | "post" | "category" | "status" | "submittedAt";
type SortDir = "asc" | "desc";
type Density = "compact" | "normal" | "comfortable";

const VIEWS = [
  "All Applications",
  "By Post",
  "Payment Pending",
  "Under Scrutiny",
  "Deficiency Raised",
  "Recommended",
  "Rejected",
  "Director Pending",
] as const;

const VIEW_STATUS_MAP: Record<string, string | null> = {
  "All Applications": null,
  "By Post": null,
  "Payment Pending": "PAYMENT_PENDING",
  "Under Scrutiny": "UNDER_SCRUTINY",
  "Deficiency Raised": "DEFICIENCY_RAISED",
  "Recommended": "RECOMMENDED",
  "Rejected": "REJECTED",
  "Director Pending": "DIRECTOR_APPROVED",
};

const PAGE_SIZES = ["10", "25", "50", "100"];

/* ═══════════════════════════════════════════════════ */
/*  Component                                          */
/* ═══════════════════════════════════════════════════ */

export function ApplicationsTable({ applications }: { applications: Row[] }) {
  // ── State ──
  const [view, setView] = useState<string>("All Applications");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [density, setDensity] = useState<Density>("normal");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // ── Derived Data ──
  const categories = useMemo(
    () => [...new Set(applications.map((a) => a.category))].sort(),
    [applications]
  );
  const statuses = useMemo(
    () => [...new Set(applications.map((a) => a.status))].sort(),
    [applications]
  );

  const filtered = useMemo(() => {
    let rows = applications;

    // View filter
    const viewStatus = VIEW_STATUS_MAP[view];
    if (viewStatus) {
      rows = rows.filter((r) => r.status === viewStatus);
    }

    // Category filter
    if (filterCategory) {
      rows = rows.filter((r) => r.category === filterCategory);
    }

    // Status filter
    if (filterStatus) {
      rows = rows.filter((r) => r.status === filterStatus);
    }

    // Search
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.applicationNo.toLowerCase().includes(q) ||
          r.applicant.name.toLowerCase().includes(q) ||
          r.post.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }

    // Sort
    rows = [...rows].sort((a, b) => {
      let av: string;
      let bv: string;
      switch (sortKey) {
        case "applicant":
          av = a.applicant.name;
          bv = b.applicant.name;
          break;
        case "post":
          av = a.post.title;
          bv = b.post.title;
          break;
        case "submittedAt":
          av = a.submittedAt ?? "";
          bv = b.submittedAt ?? "";
          break;
        default:
          av = (a as any)[sortKey] ?? "";
          bv = (b as any)[sortKey] ?? "";
      }
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [applications, view, query, sortKey, sortDir, filterCategory, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  // ── Handlers ──
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pageRows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pageRows.map((r) => r.id)));
    }
  };

  const exportCsv = useCallback(
    (rows: Row[]) => {
      const csv = [
        "Application No,Applicant,Post,Category,Status,Payment,Submitted",
        ...rows.map(
          (r) =>
            `${r.applicationNo},${r.applicant.name},${r.post.title},${r.category},${r.status},${r.paymentStatus ?? ""},${r.submittedAt ?? ""}`
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications-export.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    []
  );

  const exportSelected = () => {
    const rows = applications.filter((a) => selectedIds.has(a.id));
    exportCsv(rows);
  };

  const SortIcon = ({ field }: { field: SortKey }) => {
    if (sortKey !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-teams-ocean" />
    ) : (
      <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-teams-ocean" />
    );
  };

  const densityClass =
    density === "compact"
      ? "py-2"
      : density === "comfortable"
        ? "py-5"
        : "py-3.5";

  const quickViewApp = quickViewId
    ? applications.find((a) => a.id === quickViewId)
    : null;

  return (
    <Card className="border border-teams-border/40 shadow-sm w-full bg-white overflow-hidden">
      {/* ── View Tabs ── */}
      <div className="bg-teams-gray/20 pt-2 px-2 border-b border-teams-border/30 overflow-x-auto hide-scrollbar">
        <Tabs 
          selectedKey={view} 
          onSelectionChange={(k) => {
            setView(k.toString());
            setPage(1);
          }}
          variant="primary"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b-0",
            cursor: "w-full bg-teams-ocean",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-teams-ocean font-semibold text-foreground-500"
          }}
        >
          {VIEWS.map((v) => (
            <Tab key={v} title={v} />
          ))}
        </Tabs>
      </div>

      {/* ── Toolbar ── */}
      <div className="p-4 border-b border-teams-border/20 bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="w-full max-w-sm">
            <Input
              isClearable
              value={query}
              onValueChange={(val) => {
                setQuery(val);
                setPage(1);
              }}
              placeholder="Search applications..."
              icon={<Search className="text-foreground-400" size={16} />}
              variant="bordered"
              size="sm"
              classNames={{
                inputWrapper: "bg-white border-teams-border/60 focus-within:border-teams-ocean",
              }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Select
              selectedKeys={filterCategory ? [filterCategory] : []}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              placeholder="All Categories"
              size="sm"
              variant="bordered"
              className="w-36"
              classNames={{ trigger: "bg-white border-teams-border/60" }}
            >
              <SelectItem id="" textValue="All Categories">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem id={c} key={c} textValue={c}>{c}</SelectItem>
              ))}
            </Select>

            <Select
              selectedKeys={filterStatus ? [filterStatus] : []}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              placeholder="All Statuses"
              size="sm"
              variant="bordered"
              className="w-40"
              classNames={{ trigger: "bg-white border-teams-border/60" }}
            >
              <SelectItem id="" textValue="All Statuses">All Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem id={s} key={s} textValue={s.replaceAll("_", " ")}>{s.replaceAll("_", " ")}</SelectItem>
              ))}
            </Select>

            {/* Density Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-teams-border/40 bg-teams-gray/30 p-1">
              <Button size="sm" variant={density === "compact" ? "secondary" : "ghost"} color={density === "compact" ? "primary" : "default"} onClick={() => setDensity("compact")}>
                <Rows4 size={14} />
              </Button>
              <Button size="sm" variant={density === "normal" ? "secondary" : "ghost"} color={density === "normal" ? "primary" : "default"} onClick={() => setDensity("normal")}>
                <Rows3 size={14} />
              </Button>
              <Button size="sm" variant={density === "comfortable" ? "secondary" : "ghost"} color={density === "comfortable" ? "primary" : "default"} onClick={() => setDensity("comfortable")}>
                <Rows3 size={16} />
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              variant="ghost"
              onClick={() => exportCsv(filtered)}
              icon={<Download size={14} />}
              className="font-bold bg-success/10 text-success-600"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 bg-teams-ocean/5 px-6 py-3 border-b border-teams-ocean/10 animate-fade-in-down">
          <Checkbox 
            isSelected={selectedIds.size === pageRows.length}
            isIndeterminate={selectedIds.size > 0 && selectedIds.size < pageRows.length}
            onValueChange={toggleSelectAll}
            variant="primary"
          />
          <span className="text-sm font-bold text-teams-ocean">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
              Clear
            </Button>
            <Button size="sm" variant="ghost" onClick={exportSelected} className="bg-teams-ocean/10 text-teams-ocean font-bold">
              Export Selected
            </Button>
            <Button size="sm" variant="primary" className="bg-teams-ocean font-bold text-white shadow-sm">
              Mark Reviewed
            </Button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-teams-gray/20 border-b border-teams-border/40 text-xs uppercase tracking-wider text-foreground-500">
              <th className="px-6 py-4 w-12">
                {selectedIds.size === 0 && (
                  <Checkbox 
                    isSelected={false}
                    onValueChange={toggleSelectAll}
                    
                    size="sm"
                  />
                )}
              </th>
              <th className="px-6 py-4 cursor-pointer font-bold hover:text-teams-dark transition-colors" onClick={() => toggleSort("applicationNo")}>
                Application No <SortIcon field="applicationNo" />
              </th>
              <th className="px-6 py-4 cursor-pointer font-bold hover:text-teams-dark transition-colors" onClick={() => toggleSort("applicant")}>
                Applicant Name <SortIcon field="applicant" />
              </th>
              <th className="px-6 py-4 cursor-pointer font-bold hover:text-teams-dark transition-colors" onClick={() => toggleSort("post")}>
                Post Applied <SortIcon field="post" />
              </th>
              <th className="px-6 py-4 cursor-pointer font-bold hover:text-teams-dark transition-colors" onClick={() => toggleSort("category")}>
                Category <SortIcon field="category" />
              </th>
              <th className="px-6 py-4 cursor-pointer font-bold hover:text-teams-dark transition-colors" onClick={() => toggleSort("status")}>
                Status <SortIcon field="status" />
              </th>
              <th className="px-6 py-4 font-bold">Payment</th>
              <th className="px-6 py-4 cursor-pointer font-bold hover:text-teams-dark transition-colors" onClick={() => toggleSort("submittedAt")}>
                Submitted <SortIcon field="submittedAt" />
              </th>
              <th className="px-6 py-4 w-16 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teams-border/20">
            {pageRows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "hover:bg-teams-gray/20 transition-colors cursor-pointer",
                  selectedIds.has(row.id) && "bg-teams-ocean/5"
                )}
                onClick={() => setQuickViewId(row.id)}
              >
                <td className={cn("px-6", densityClass)} onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    isSelected={selectedIds.has(row.id)}
                    onValueChange={() => toggleSelect(row.id)}
                    variant="primary"
                    size="sm"
                  />
                </td>
                <td className={cn("px-6 font-bold text-teams-ocean", densityClass)}>
                  {row.applicationNo}
                </td>
                <td className={cn("px-6 font-medium text-teams-dark", densityClass)}>{row.applicant.name}</td>
                <td className={cn("px-6 text-foreground-600 max-w-[200px] truncate", densityClass)}>
                  {row.post.title}
                </td>
                <td className={cn("px-6", densityClass)}>
                  <ColourTag value={row.category} />
                </td>
                <td className={cn("px-6", densityClass)}>
                  <ColourTag value={row.status} />
                </td>
                <td className={cn("px-6", densityClass)}>
                  <ColourTag value={row.paymentStatus ?? "Pending"} />
                </td>
                <td className={cn("px-6 text-foreground-500 font-medium", densityClass)}>
                  {row.submittedAt
                    ? new Date(row.submittedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className={cn("px-6 text-center", densityClass)} onClick={(e) => e.stopPropagation()}>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button  size="sm" variant="ghost" className="text-foreground-400">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Action menu">
                      <DropdownItem key="view" startContent={<Eye size={14} />} onClick={() => setQuickViewId(row.id)}>
                        View Details
                      </DropdownItem>
                      <DropdownItem key="scrutiny" startContent={<ClipboardCheck size={14} />}>
                        <a href={`/admin/scrutiny?app=${row.applicationNo}`}>Open in Scrutiny</a>
                      </DropdownItem>
                      <DropdownItem key="export" startContent={<FileDown size={14} />} onClick={() => exportCsv([row])}>
                        Export
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-foreground-400">
                    <Search size={32} className="mb-3 opacity-50" />
                    <p className="font-medium">No applications match your filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-teams-border/20 bg-teams-gray/10">
          <p className="text-xs font-semibold text-foreground-500">
            Showing {startIdx} to {endIdx} of {filtered.length} entries
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground-500">Rows per page:</span>
              <Select
                selectedKeys={[pageSize.toString()]}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                size="sm"
                variant="bordered"
                className="w-20"
                classNames={{ trigger: "h-8 min-h-0 bg-white" }}
              >
                {PAGE_SIZES.map((s) => (
                  <SelectItem id={s} key={s} textValue={s}>{s}</SelectItem>
                ))}
              </Select>
            </div>
            <Pagination 
              total={totalPages} 
              page={safePage} 
              onChange={setPage}
              showControls
              variant="flat"
              size="sm"
              classNames={{
                cursor: "bg-teams-ocean font-bold",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Quick View Drawer ── */}
      {quickViewApp && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setQuickViewId(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col border-l border-teams-border/40">
            <div className="flex items-center justify-between p-6 border-b border-teams-border/40 bg-teams-gray/10">
              <h2 className="text-xl font-bold text-teams-dark">
                Application Details
              </h2>
              <Button size="sm" variant="ghost" onClick={() => setQuickViewId(null)}>
                <X size={18} />
              </Button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="rounded-xl border border-teams-border/30 bg-teams-gray/20 p-5">
                <dl className="grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
                  <div>
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Application No
                    </dt>
                    <dd className="font-bold text-teams-ocean text-base">
                      {quickViewApp.applicationNo}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Applicant
                    </dt>
                    <dd className="font-bold text-teams-dark">
                      {quickViewApp.applicant.name}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Post Applied
                    </dt>
                    <dd className="text-foreground-700 font-medium">
                      {quickViewApp.post.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Category
                    </dt>
                    <dd>
                      <ColourTag value={quickViewApp.category} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Status
                    </dt>
                    <dd>
                      <ColourTag value={quickViewApp.status} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Payment
                    </dt>
                    <dd>
                      <ColourTag value={quickViewApp.paymentStatus ?? "Pending"} />
                    </dd>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-teams-border/20">
                    <dt className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-1">
                      Submitted At
                    </dt>
                    <dd className="text-foreground-700 font-medium">
                      {quickViewApp.submittedAt
                        ? new Date(quickViewApp.submittedAt).toLocaleString("en-IN")
                        : "Not submitted"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  
                  href={`/admin/scrutiny?app=${quickViewApp.applicationNo}`}
                  variant="primary"
                  className="flex-1 font-bold bg-teams-ocean text-white shadow-md"
                  icon={<ClipboardCheck size={16} />}
                >
                  Open in Scrutiny
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    exportCsv([quickViewApp]);
                    setQuickViewId(null);
                  }}
                  className="font-bold bg-success/10 text-success-700"
                  icon={<FileDown size={16} />}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
