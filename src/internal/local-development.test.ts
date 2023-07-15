import { SlackWebApi } from "./api";
import { createMessageWithDataBlocks } from "./block-templates";

const AUTH_TOKEN = process.env["SLACK_AUTH_TOKEN"] ?? "";
const CHANNEL_ID = process.env["SLACK_CHANNEL_ID"] ?? "";
// 開発時はtrueにする。このテストがgit hooksのタイミングで走ると都合が悪いのでこの設定を入れている。
const runLocalTest = false;

// Slack APIを手元から実行して動作確認するためのテストファイル
test("local development", async () => {
  // WebStormでrunIfを使うとテストの個別実行ができなくなってしまうため、if文で制御している
  if (!runLocalTest) {
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
