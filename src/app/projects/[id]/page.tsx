"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectBySlugOrId, getProjectSlug } from "@/data/projectsData";

export default function ProjectsIdRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  useEffect(() => {
    if (id) {
      const project = getProjectBySlugOrId(id);
      const targetSlug = project ? getProjectSlug(project) : id;
      router.replace(`/work/${targetSlug}`);
    } else {
      router.replace("/work");
    }
  }, [id, router]);

  return null;
}
