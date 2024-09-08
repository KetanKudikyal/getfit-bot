import { HandlerContext } from "@xmtp/message-kit";

// Handler function to process game-related commands
export async function handler(context: HandlerContext) {
  const {
    message: {
      content: {
        command,
        params: { match },
      },
    },
  } = context;

  // URLs for each game type
  const matchDescriptions: { [key: string]: string } = {
    conor_floyd:
      "A fierce competition to see who can get the highest score in a game of Go, with a twist of Elixir. who will conor or floyd? Bet now on conor or elixir by sending /bet conor or /bet floyd",
  };

  console.log(match, "ma");

  // Respond with the appropriate game URL or an error message
  switch (match) {
    case "conor_floyd":
      const matchDescription = matchDescriptions[match];
      context.send(matchDescription);
      break;
    case "help":
      context.send("Available matches: \n/match conor_floyd");
      break;
    default:
      context.send(
        "Command not recognized. Available matches: conor_floyd, or help.",
      );
  }
}
