"use client";

import { useState, useTransition } from "react";
import { createJob } from "@/app/actions/job";

export default function AddJobForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!company.trim() || !role.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("company", company);
    formData.append("role", role);
    formData.append("status", status);

    startTransition(async () => {
      const result = await createJob(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setCompany("");
        setRole("");
        setStatus("APPLIED");
      }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Add Job Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-sm rounded-lg">
            Job application added successfully!
          </div>
        )}

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            required
            placeholder="e.g. Google, Stripe, etc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isPending}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
            Role / Position
          </label>
          <input
            id="role"
            type="text"
            required
            placeholder="e.g. Frontend Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isPending}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">
            Application Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isPending}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            "Add Application"
          )}
        </button>
      </form>
    </div>
  );
}
