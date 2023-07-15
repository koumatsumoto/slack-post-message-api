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
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.#config.authToken}`,
      },
      body: JSON.stringify({
        channel: this.#config.channelId,
        ...params,
      }),
    }).then(handleResponse<PostMessageResult>);
  }
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
