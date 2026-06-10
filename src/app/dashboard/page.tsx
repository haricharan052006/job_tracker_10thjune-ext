"use client";

import { useState, useEffect } from "react";

interface Job {
  id: string;
  company: string;
  role: string;
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  createdAt: Date;
}

const INITIAL_MOCK_JOBS: Job[] = [
  {
    id: "1",
    company: "Google",
    role: "Software Engineering Intern",
    status: "APPLIED",
    createdAt: new Date("2026-06-01"),
  },
  {
    id: "2",
    company: "Stripe",
    role: "Frontend Engineer",
    status: "INTERVIEWING",
    createdAt: new Date("2026-06-05"),
  },
  {
    id: "3",
    company: "Meta",
    role: "Product Designer",
    status: "OFFERED",
    createdAt: new Date("2026-06-08"),
  },
  {
    id: "4",
    company: "Netflix",
    role: "Fullstack Developer",
    status: "REJECTED",
    createdAt: new Date("2026-05-20"),
  },
];

export default function DashboardPage() {
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  const [extensionJobs, setExtensionJobs] = useState<Job[]>([]);

  // Periodically fetch extension jobs from the API route for real-time updates
  useEffect(() => {
    const fetchExtensionJobs = async () => {
      try {
        const res = await fetch("/api/jobs/extension");
        const data = await res.json();
        if (data.success && data.jobs) {
          const parsedJobs = data.jobs.map((j: any) => ({
            ...j,
            createdAt: new Date(j.createdAt),
          }));
          setExtensionJobs(parsedJobs);
        }
      } catch (err) {
        console.error("Failed to fetch extension jobs:", err);
      }
    };

    fetchExtensionJobs(); // initial fetch
    const interval = setInterval(fetchExtensionJobs, 2000); // check for new scraped jobs every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Merge lists and sort by date descending so newest additions appear at the top
  const jobs = [...localJobs, ...extensionJobs, ...INITIAL_MOCK_JOBS].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Form State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED">("APPLIED");

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Handle mock submission
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newJob: Job = {
      id: Date.now().toString(),
      company: company.trim(),
      role: role.trim(),
      status,
      createdAt: new Date(),
    };

    setLocalJobs([newJob, ...localJobs]);
    setCompany("");
    setRole("");
    setStatus("APPLIED");
  };

  // Calculate statistics directly from local state
  const totalApplications = jobs.length;
  const activeInterviews = jobs.filter((j) => j.status === "INTERVIEWING").length;
  const offersReceived = jobs.filter((j) => j.status === "OFFERED").length;

  // Filter jobs based on user controls
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === "ALL" || job.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20">
            Applied
          </span>
        );
      case "INTERVIEWING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400 border border-purple-400/20">
            Interviewing
          </span>
        );
      case "OFFERED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            Offered
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-400/10 text-rose-400 border border-rose-400/20">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-400/10 text-slate-400 border border-slate-400/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiasedSelection">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-600/20">
              J
            </div>
            <span className="font-semibold text-lg tracking-tight">JobTracker</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400 hidden sm:inline">
              Welcome back, <strong className="text-slate-200">Demo User</strong>
            </span>
            <button className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Isolate UI View: Manage and track your active job applications locally.</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Total Applications */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-lg shadow-slate-950/50 flex flex-col justify-between min-h-[110px]">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Applications</div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="text-3xl font-extrabold text-white tracking-tight">{totalApplications}</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50 font-medium">Logged</div>
            </div>
          </div>

          {/* Card 2: Active Interviews */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 hover:border-amber-500/30 transition-all duration-300 shadow-lg shadow-amber-950/10 flex flex-col justify-between min-h-[110px] relative overflow-hidden group">
            <div className="absolute top-4 right-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-amber-400/90">Active Interviews</div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{activeInterviews}</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">In Progress</div>
            </div>
          </div>

          {/* Card 3: Offers Received */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 hover:border-emerald-500/30 transition-all duration-300 shadow-lg shadow-emerald-950/10 flex flex-col justify-between min-h-[110px]">
            <div className="text-xs font-medium uppercase tracking-wider text-emerald-400/90">Offers Received</div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{offersReceived}</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">Success 🎉</div>
            </div>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Panel: Filters & Job Table */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Control Panel: Filters & Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by company or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["ALL", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition whitespace-nowrap ${
                      statusFilter === f
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                          No matching applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-950/20 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-white">{job.company}</td>
                          <td className="px-6 py-4 text-sm text-slate-300">{job.role}</td>
                          <td className="px-6 py-4 text-sm">{getStatusBadge(job.status)}</td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(job.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel: Add Job Control (Interactive Mock Form) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full">
            <h2 className="text-xl font-bold text-white mb-4">Track New Job</h2>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role / Position</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Application Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Add Application
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
