import { HandlerContext } from "@xmtp/message-kit";
import { textGeneration } from "../lib/openai.js";

export async function handler(context: HandlerContext) {
  if (!process?.env?.OPEN_AI_API_KEY) {
    console.log("No OPEN_AI_API_KEY found in .env");
    return;
  }

  const {
    message: {
      content: { content, params },
    },
  } = context;

  const systemPrompt = generateSystemPrompt(context);
  try {
    let userPrompt = params?.prompt ?? content;
    if (process?.env?.MSG_LOG === "true") {
      console.log("userPrompt", userPrompt);
    }

    const { reply } = await textGeneration(userPrompt, systemPrompt);
    console.log("intent:", reply);
    context.intent(reply);
    context.send(reply);
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    await context.reply("An error occurred while processing your request.");
  }
}

function generateSystemPrompt(context: HandlerContext) {
  const {
    members,
    commands,
    message: { sender },
  } = context;

  const systemPrompt = `You are a helpful agent that lives inside a web3 messaging group.\n
  if the user asks general questions answer them as best as you can.
  Dont prompt the user to use a command if they are not asking to bet or perform an action.
  If the chat contains place bet <amount> use the command "/bet {player} {amount} {token}" and keep all the commands in lowercase remove @ from the command and trigger to generate frame.\n
  If the user's prompt resolves to a command, return the command and nothing else.
  .`;

  return systemPrompt;
}
