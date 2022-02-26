import { Client, DiscordAPIError, Intents, TextBasedChannel, Typing as RawTyping } from "discord.js";
import { DiscordError } from "../models/eyes";

export class DiscordClient {
  public token: string | undefined;

  private readonly raw = new Client({
    partials: ["CHANNEL"],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING]
  });

  public constructor() {
    this.raw.on("ready", () => {
      if (this.raw.user === null) return;
      console.log(`Logged in as ${this.raw.user.tag}!`);
    });
  }

  public async login() {
    if (this.token === undefined) {
      throw Error("`token` is undefined.");
    }

    await this.raw.login(this.token);
  }

  public onTypingStarted(handler: (typing: RawTyping) => PromiseLike<void>) {
    this.raw.on("typingStart", async (typing) => await handler(typing));
  }

  public async fetchTextChannel(channelId: string): Promise<TextBasedChannel> {
    let channel;
    try {
      channel = await this.raw.channels.fetch(channelId);
    } catch (error) {
      if (error instanceof DiscordAPIError) throw new DiscordError();
      throw error;
    }

    if (channel === null || !channel.isText()) {
      throw Error(`The channel id=${channelId} is not text channel or not exist.`);
    }
    return channel;
  }
}
