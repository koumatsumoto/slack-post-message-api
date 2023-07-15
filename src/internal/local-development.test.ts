import { SlackWebApi } from "./api";
import { createMessageWithDataBlocks } from "./block-templates";

const AUTH_TOKEN = process.env["SLACK_AUTH_TOKEN"] ?? "";
const CHANNEL_ID = process.env["SLACK_CHANNEL_ID"] ?? "";
const hasEnvironments = AUTH_TOKEN && CHANNEL_ID;

// Slack APIを手元から実行して動作確認するためのテストファイル
test("local development", async () => {
  // WebStormでrunIfを使うとテストの個別実行ができなくなってしまうため、if文で制御している
  if (!hasEnvironments) {
    return;
  }

  const api = new SlackWebApi({
    authToken: AUTH_TOKEN,
    channelId: CHANNEL_ID,
  });

  const res = await api.postMessage({
    blocks: createMessageWithDataBlocks("hello from local test", {
      field1: "field1",
      field2: "field2",
    }),
  });
  expect(res).toBeDefined();
});
