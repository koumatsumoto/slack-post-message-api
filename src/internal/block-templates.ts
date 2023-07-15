/**
 * 便利のために個人的によく使うblocksのテンプレートをこのモジュールに含めてある
 */
import type { Block, KnownBlock } from "./parameter-types";
import { stringify } from "./stringify";

export function createMessageWithDataBlocks(heading: string, data?: Record<string, any>) {
  const blocks: (KnownBlock | Block)[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: heading,
      },
    },
  ];

  if (data) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: Object.entries(data)
            .map(([k, v]) => `${k}: ${stringify(v)}`)
            .join("\n"),
        },
      ],
    });
  }

  return blocks;
}
