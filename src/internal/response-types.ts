// slack web apiの共通レスポンス型
type SuccessResponse<T extends object> = { ok: true } & T;
type ErrorResponse = { ok: false; error: string };
export type SlackApiResponse<T extends object> = SuccessResponse<T> | ErrorResponse;

// chat.postMessageの結果データ
export interface PostMessageResult {
  channel: string;
  ts: string; // 1689392456.617489
  message: {
    app_id: string;
    bot_id: string;
    type: "message";
    team: string;
    user: string;
    text: string;
    blocks: object[];
    ts: string;
    bot_profile: {
      id: string;
      app_id: string;
      team_id: string;
      name: string;
      icons: {
        image_36: string;
        image_48: string;
        image_72: string;
      };
      deleted: boolean;
      updated: number; // 1677024608
    };
  };
}
