import { libreBookingRequest } from "@/lib/librebooking/client";
import { mapResource } from "./mapper";
import type { ResourceSummary } from "./types";

type ResourceResponse = { resources: Parameters<typeof mapResource>[0][] };

export async function listResources(): Promise<ResourceSummary[]> {
  const response = await libreBookingRequest<ResourceResponse>("/resources");
  return response.resources.map(mapResource);
}
