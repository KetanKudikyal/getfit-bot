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
    context.send(
      "Missing required parameters. Please provide player, amount, and token.",
    );
    return;
  }

  // if (amount < 15) {
  //   context.send("Amount must be greater than 15.");
  //   return;
  // }

  const playerMap = {
    floyd: "floyd",
    conor: "conor",
  };

  if (token !== "usdc") {
    context.send("Token must be usdc.");
    return;
  }
  await context.send(`Bet created! Go to the frame`);
  await context.send(
    `https://get-fit-frontend.vercel.app/frame?amount=${amount}&player=${playerMap[player as keyof typeof playerMap].toLowerCase()}`,
  );
}
