import { Job } from "@/generated/client";

type JobStatus = "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";

interface JobTableProps {
  jobs: Job[];
}

export default function JobTable({ jobs }: JobTableProps) {
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

  if (jobs.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-lg">
        <p className="text-slate-400 text-sm">No job applications added yet.</p>
        <p className="text-xs text-slate-500 mt-1">Use the form to track your first application!</p>
      </div>
    );
  }

  return (
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
            {jobs.map((job) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
