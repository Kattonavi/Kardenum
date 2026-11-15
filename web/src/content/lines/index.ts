import type { LinePageContent, ServiceLineId } from "../types";
import { desarrollo } from "./desarrollo";
import { diseno } from "./diseno";
import { discord } from "./discord";
import { minecraft } from "./minecraft";
import { video } from "./video";

/** Content of the five service line pages, by line. */
export const linePages: Record<ServiceLineId, LinePageContent> = { desarrollo, diseno, video, minecraft, discord };
