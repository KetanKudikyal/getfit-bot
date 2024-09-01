import { HandlerContext } from "@xmtp/message-kit";

// Handler function to process game-related commands
export async function handler(context: HandlerContext) {
  const {
    message: {
      content: {
        command,
        params: { player, amount, token },
      },
    },
  } = context;

  console.log(player, amount, token);

  if (!player || !amount || !token) {
    context.reply(
      "Missing required parameters. Please provide player, amount, and token.",
    );
    return;
  }

  if (amount < 15) {
    context.reply("Amount must be greater than 15.");
    return;
  }

  if (token !== "usdc") {
    context.reply("Token must be usdc.");
    return;
  }

  await context.reply(
    `Bet created!. Go to the frame: https://get-fit-frontend.vercel.app/frame`,
  );
}
