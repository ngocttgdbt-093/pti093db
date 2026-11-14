import test from "node:test";
import assert from "node:assert/strict";
import { makePayload, dispatch } from "./src/index.js";

test("08:00 Vietnam = 01:00 UTC, exact date and mode",()=>{
  assert.deepEqual(makePayload("0 1 * * *", Date.parse("2026-11-15T01:00:00Z")),{
    mode:"morning",scheduledFor:"2026-11-15T01:00:00.000Z",
    localDate:"2026-11-15",idempotencyKey:"pti093:2026-11-15:morning"});
});
test("watchdog and retry modes",()=>{
  assert.equal(makePayload("20 1 * * *", Date.parse("2026-11-15T01:20:00Z")).mode,"morning_watchdog");
  assert.equal(makePayload("30 5 * * *", Date.parse("2026-11-15T05:30:00Z")).mode,"retry");
});
test("unsupported cron rejected",()=>assert.throws(()=>makePayload("* * * * *",Date.now()),/UNEXPECTED_CRON/));
test("secret missing rejected before network",async()=>{
  await assert.rejects(dispatch({cron:"0 1 * * *",scheduledTime:Date.now()},{PTI093_CRON_ENDPOINT:"https://example.org/sync"}),/CRON_NOT_CONFIGURED/);
});
test("HTTPS only",async()=>{
  await assert.rejects(dispatch({cron:"0 1 * * *",scheduledTime:Date.now()},{PTI093_CRON_ENDPOINT:"http://example.org/sync",PTI093_CRON_SECRET:"test"}),/HTTPS_REQUIRED/);
});
test("authenticated request and accepted response never mislabeled as completed",async()=>{
  let captured;
  const result=await dispatch({cron:"0 1 * * *",scheduledTime:Date.parse("2026-11-15T01:00:00Z")},
    {PTI093_CRON_ENDPOINT:"https://example.org/internal/sync",PTI093_CRON_SECRET:"dummy-test-secret"},
    async(url,opts)=>{captured={url,opts};return {ok:true,json:async()=>({status:"accepted",runId:"fake-run"})};});
  assert.equal(result.status,"accepted");
  assert.equal(captured.opts.method,"POST");
  assert.equal(captured.opts.headers.Authorization,"Bearer dummy-test-secret");
  assert.equal(JSON.parse(captured.opts.body).localDate,"2026-11-15");
});
test("failed backend rejects",async()=>await assert.rejects(dispatch(
  {cron:"0 1 * * *",scheduledTime:Date.now()},
  {PTI093_CRON_ENDPOINT:"https://example.org/sync",PTI093_CRON_SECRET:"dummy"},
  async()=>({ok:false,status:503})),/CRON_BACKEND_HTTP_503/));
