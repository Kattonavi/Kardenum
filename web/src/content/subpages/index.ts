import type { SubpageContent, SubpageId } from "../types";
import { bots } from "./bots";
import { plugins } from "./plugins";
import { servidores } from "./servidores";
import { softwareALaMedida } from "./software-a-la-medida";
import { tebex } from "./tebex";
import { tiendasOnline } from "./tiendas-online";

/** Content of the six service sub-pages, by id. */
export const subpages: Record<SubpageId, SubpageContent> = {
  "tiendas-online": tiendasOnline,
  "software-a-la-medida": softwareALaMedida,
  plugins,
  servidores,
  tebex,
  bots,
};
