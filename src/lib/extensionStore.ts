export interface ExtensionJob {
  id: string;
  company: string;
  role: string;
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  createdAt: Date;
}

const globalForExtensionStore = globalThis as unknown as {
  extensionJobs: ExtensionJob[] | undefined;
};

// Initialize the array or use the existing global one to survive hot reloads
export const extensionJobs = globalForExtensionStore.extensionJobs ?? [];

if (process.env.NODE_ENV !== "production") {
  globalForExtensionStore.extensionJobs = extensionJobs;
}

export function addExtensionJob(job: { company: string; role: string }) {
  const newJob: ExtensionJob = {
    id: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    company: job.company,
    role: job.role,
    status: "APPLIED", // Default status for new extensions
    createdAt: new Date(),
  };
  extensionJobs.unshift(newJob); // Put newer ones at the top
  return newJob;
}
