"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_STATUSES: readonly string[] = ["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"];
type JobStatus = "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";

export async function createJob(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to perform this action." };
    }

    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const status = formData.get("status") as string;

    if (!company || !role || !status) {
      return { error: "All fields (Company, Role, Status) are required." };
    }

    // Validate that the status is a valid value
    if (!VALID_STATUSES.includes(status)) {
      return { error: "Invalid status value." };
    }

    await prisma.job.create({
      data: {
        company: company.trim(),
        role: role.trim(),
        status,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating job:", error);
    return { error: "Something went wrong while creating the job application." };
  }
}
