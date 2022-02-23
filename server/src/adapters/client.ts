import { Client, Intents, Typing as RawTyping } from "discord.js";

export class DiscordClient {
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

  public async initialize(token: string) {
    await this.raw.login(token);
  }

  public onTypingStarted(handler: (typing: RawTyping) => PromiseLike<void>) {
    this.raw.on("typingStart", async (typing) => await handler(typing));
  }
}
