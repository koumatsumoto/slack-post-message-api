import type { PostMessageParams } from "./parameter-types";
import type { PostMessageResult, SlackApiResponse } from "./response-types";

interface Config {
  authToken: string;
  channelId: string;
}

export class SlackWebApi {
  readonly #config: Config;

  constructor(config: Config) {
    this.#config = config;
  }

  async postMessage(params: PostMessageParams): Promise<SlackApiResponse<PostMessageResult>> {
    return await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        // content-type=application/jsonはcorsの問題がある
        // ブラウザから使うためにはapplication/x-www-form-urlencodedを使う必要がある
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: makeFormUrlencodedData({
        token: this.#config.authToken,
        channel: this.#config.channelId,
        ...params,
      }),
    }).then(handleResponse<PostMessageResult>);
  }
}

function makeFormUrlencodedData(values: Record<string, any>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === undefined ||
      value === null
    ) {
      params.set(key, String(value));
    } else {
      params.set(key, JSON.stringify(value));
    }
  }
  return params.toString();
}

async function handleResponse<T extends Record<string, any>>(res: Response): Promise<SlackApiResponse<T>> {
  const data: SlackApiResponse<T> = await res.json();

  // slack web apiのエラー仕様
  // パラメータエラーなどでエラーになった場合でも、status codeは200で返される
  // エラーになったかどうかの判定は、bodyのokフィールドを使って行う必要がある
  if (!data.ok) {
    throw new Error(data.error);
  }

  return data;
}
