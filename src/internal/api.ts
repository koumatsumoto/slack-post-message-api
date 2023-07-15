import type { PostMessageParams } from "./parameter-types";
import type { PostMessageResult, SlackApiResponse } from "./response-types";
import { stringify } from "./stringify";

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
  return new URLSearchParams(Object.entries(values).map(([key, value]) => [key, stringify(value)])).toString();
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
