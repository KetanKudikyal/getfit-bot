import { ReactionCodec } from "@xmtp/content-type-reaction";
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import { ReplyCodec } from "@xmtp/content-type-reply";
import { TextCodec } from "@xmtp/content-type-text";
import { Client, ClientOptions, XmtpEnv } from "@xmtp/mls-client";
import { Client as V2Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import * as fs from "fs";
import { createWalletClient, http, isHex, toBytes } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

export default async function xmtpClient(
  clientConfig: ClientOptions = {},
  privateKey: string | null = null,
): Promise<{ client: Client; v2client: V2Client }> {
  let key = process.env.KEY;
  if (!key || !isHex(key)) {
    key = generatePrivateKey();
    console.error(
      "KEY not set. Using random one. For using your own wallet , set the KEY environment variable.",
    );
    console.log("Random private key: ", key);
  }

  const account = privateKeyToAccount(key as `0x${string}`);
  const wallet = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });

  let env = process.env.XMTP_ENV as XmtpEnv;
  if (!env) {
    env = "production" as XmtpEnv;
  }

  if (!fs.existsSync(`.cache`)) {
    fs.mkdirSync(`.cache`);
  }

  const defaultConfig: ClientOptions = {
    env: env,
    dbPath: `.cache/${wallet.account?.address}-${env}`,
    codecs: [
      new TextCodec(),
      new ReactionCodec(),
      new ReplyCodec(),
      new RemoteAttachmentCodec(),
      new AttachmentCodec(),
    ],
  };
  // Merge the default configuration with the provided config. Repeated fields in clientConfig will override the default values
  const finalConfig = { ...defaultConfig, ...clientConfig };
  const client = await Client.create(account.address, finalConfig);
  //v2
  const wallet2 = new Wallet(key);
  const v2client = await V2Client.create(wallet2, finalConfig);

  if (process.env.MSG_LOG) {
    // Log the version of the package
    console.log("XMTP Client: ", {
      accountAddress: client.accountAddress,
      inboxId: client.inboxId,
      installationId: client.installationId,
    });
  }

  // register identity
  if (!client.isRegistered && client.signatureText) {
    const signature = await wallet.signMessage({
      message: client.signatureText,
    });
    const signatureBytes = toBytes(signature);
    client.addEcdsaSignature(signatureBytes);
    await client.registerIdentity();
  }

  console.log(`Listening on ${client.accountAddress}`);
  //v2
  return { client, v2client };
}
