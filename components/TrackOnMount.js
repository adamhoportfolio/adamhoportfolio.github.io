"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

// Fires one event when a page renders, e.g. <TrackOnMount event="not_found" />
export default function TrackOnMount({ event }) {
  const pathname = usePathname();
  useEffect(() => { track(event, { path: pathname }); }, [event, pathname]);
  return null;
}
