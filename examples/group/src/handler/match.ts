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
    goggin_elixir:
      "A fierce competition to see who can get the highest score in a game of Go, with a twist of Elixir. who will goggin or elixir? Bet now on goggin or elixir by sending /bet goggin or /bet elixir",
  };

  console.log(match, "ma");

  // Respond with the appropriate game URL or an error message
  switch (match) {
    case "goggin_elixir":
      const matchDescription = matchDescriptions[match];
      context.send(matchDescription);
      break;
    case "help":
      context.send("Available matches: \n/match goggin_elixir");
      break;
    default:
      context.send(
        "Command not recognized. Available matches: goggin_elixir, or help.",
      );
  }
}
