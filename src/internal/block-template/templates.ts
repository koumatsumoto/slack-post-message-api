/**
 * 便利のために個人的によく使うblocksのテンプレートをこのモジュールに含めてある
 */

type PrimitiveValue = string | number | boolean | null | undefined;

export function createTitleAndDatalinesBlocks(heading: string, data: Record<string, PrimitiveValue>) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: heading,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: Object.entries(data)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n"),
        },
      ],
    },
  ];
}
