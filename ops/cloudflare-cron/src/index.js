// PTI093 cron bridge. Deliberately DOES NOT call the private MCP tools directly.
// The backend must expose and authorize a narrow cron-only HTTPS endpoint with
// an idempotent server-side orchestration and final verification.
const MODES = Object.freeze({
  "0 1 * * *": "morning",
  "20 1 * * *": "morning_watchdog",
  "30 5 * * *": "retry",
});
const TIMEZONE = "Asia/Ho_Chi_Minh";

function localDate(utcMs) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date(utcMs));
  const fields = Object.fromEntries(parts.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
  return `${fields.year}-${fields.month}-${fields.day}`;
}

export function makePayload(cron, scheduledTime) {
  const mode = MODES[cron];
  if (!mode) throw new Error("UNEXPECTED_CRON");
  if (!Number.isFinite(scheduledTime)) throw new Error("INVALID_SCHEDULED_TIME");
  return {
    mode,
    scheduledFor: new Date(scheduledTime).toISOString(),
    localDate: localDate(scheduledTime),
    idempotencyKey: `pti093:${localDate(scheduledTime)}:${mode}`
  };
}

export async function dispatch(controller, env, fetcher = fetch) {
  if (!env?.PTI093_CRON_ENDPOINT || !env?.PTI093_CRON_SECRET)
    throw new Error("CRON_NOT_CONFIGURED");
  const url = new URL(env.PTI093_CRON_ENDPOINT);
  if (url.protocol !== "https:") throw new Error("HTTPS_REQUIRED");
  const payload = makePayload(controller.cron, controller.scheduledTime);
  const response = await fetcher(url.toString(), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.PTI093_CRON_SECRET}`,
      "Content-Type": "application/json",
      "Idempotency-Key": payload.idempotencyKey
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(25000),
    redirect: "error"
  });
  if (!response.ok) throw new Error(`CRON_BACKEND_HTTP_${response.status}`);
  // Accepted means merely queued. Do not advertise as a successful sync.
  const result = await response.json();
  if (!result || !["completed", "already_verified", "running", "accepted", "skipped"].includes(result.status))
    throw new Error("CRON_INVALID_BACKEND_RESPONSE");
  console.log(JSON.stringify({
    event: "pti093_cron_dispatch", mode: payload.mode,
    scheduledFor: payload.scheduledFor, status: result.status,
    runId: typeof result.runId === "string" ? result.runId : null
  }));
  return result;
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(dispatch(controller, env));
  }
};
