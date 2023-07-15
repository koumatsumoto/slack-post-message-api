import { rest, RestRequest } from "msw";
import { setupServer } from "msw/node";
import { SlackWebApi } from "./api";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());

test("SlackWebApi parameters and responses", async () => {
  let request: RestRequest | undefined;
  const responseBody = { ok: true };

  server.use(
    rest.post("https://slack.com/api/chat.postMessage", (req, res, ctx) => {
      request = req;
      return res(ctx.json(responseBody));
    }),
  );

  const config = { authToken: "AUTH_TOKEN", channelId: "CHANNEL_ID" };
  const api = new SlackWebApi(config);

  const result = await api.postMessage({ text: "hello" });

  // authorizationとcontent-typeのheaderの設定が必須
  expect(request?.headers.get("authorization")).toBe("Bearer AUTH_TOKEN");
  expect(request?.headers.get("content-type")).toBe("application/json; charset=utf-8");
  // channelのフィールドがconfigの値で設定されている
  expect(await request?.json()).toStrictEqual({
    channel: "CHANNEL_ID",
    text: "hello",
  });
  // responseがそのまま返却されている
  expect(result).toStrictEqual(responseBody);
});

test("SlackWebApi on error", async () => {
  // slack web apiでエラーの場合、bodyのokフィールドがfalse, errorに原因が返される
  const responseBody = { ok: false, error: "Error Message" };

  server.use(
    rest.post("https://slack.com/api/chat.postMessage", (_, res, ctx) => {
      return res(ctx.json(responseBody));
    }),
  );

  const api = new SlackWebApi({ authToken: "AUTH_TOKEN", channelId: "CHANNEL_ID" });
  await expect(api.postMessage({ text: "hello" })).rejects.toThrow("Error Message");
});
