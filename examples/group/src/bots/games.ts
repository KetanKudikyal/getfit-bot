import { HandlerContext } from "@xmtp/botkit";

export async function handler(context: HandlerContext) {
  const { content } = context.message;
  const { params } = content;

  const baseUrlMap = {
    wordle: "https://openframedl.vercel.app/",
    slot: "https://slot-machine-frame.vercel.app/",
    guess: "https://farguessr.vercel.app/",
  };
  switch (params.type) {
    case "wordle":
    case "slot":
    case "guess":
      context.reply(baseUrlMap[params.type as keyof typeof baseUrlMap]);
      break;
    default:
      context.reply(
        "Command not recognized. Available games: worlde, slot, guess or help.",
      );
  }
}
