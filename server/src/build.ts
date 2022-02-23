import { EyesSender } from "./models/eyes";
import { SendEyesSettingsProviderImpl } from "./adapters/settings";
import { RandomSourceImpl } from "./adapters/random";
import { TypingEventProviderImpl } from "./adapters/typing";
import { DiscordClient } from "./adapters/client";
import * as dotenv from "dotenv";

export class ServerBuilder {
  private client: DiscordClient | undefined;
  private typingEvent: TypingEventProviderImpl | undefined;
  private eyesSender: EyesSender | undefined;

  public build(): void {
    this.client = new DiscordClient();
    this.typingEvent = new TypingEventProviderImpl(this.client);
    const random = new RandomSourceImpl();
    const settings = new SendEyesSettingsProviderImpl();
    this.eyesSender = new EyesSender(this.typingEvent, random, settings);
  }

  public start(): void {
    if (this.client === undefined || this.typingEvent === undefined || this.eyesSender === undefined) {
      throw Error("Please invoke `build()` before `start()`.");
    }

    dotenv.config();
    const discordToken = process.env["DISCORD_TOKEN"];
    if (discordToken === undefined) {
      throw Error("Discord token is not set.");
    }

    this.typingEvent.initialize();
    this.eyesSender.registerEvent();
    void this.client.initialize(discordToken);
  }
}
