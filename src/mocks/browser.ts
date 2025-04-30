import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

declare global {
  interface Window {
    msw: {
      worker: ReturnType<typeof setupWorker>;
    };
  }
}

export const worker = setupWorker(...handlers);

window.msw = { worker };
