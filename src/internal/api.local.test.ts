import { SlackWebApi } from "./api";

test.skip("SlackWebApi local development", async () => {
  const api = new SlackWebApi({
    authToken: String(process.env["SLACK_AUTH_TOKEN"]),
    channelId: String(process.env["SLACK_CHANNEL_ID"]),
  });

  expect(api).toBeDefined();
});
