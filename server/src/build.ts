import { EyesSender } from "./models/eyes";
import { RandomSourceImpl } from "./adapters/random";
import { TypingEventProviderImpl } from "./adapters/typing";
import { DiscordClient } from "./adapters/client";
import { EnvironmentLoader } from "./environment";
import { ConsoleLogger } from "./adapters/logger";

export class ServerBuilder {
  private client: DiscordClient | undefined;
  private typingEvent: TypingEventProviderImpl | undefined;
  private eyesSender: EyesSender | undefined;

  public build(): void {
    const logger = new ConsoleLogger();
    const random = new RandomSourceImpl();
    this.client = new DiscordClient(logger);
    this.typingEvent = new TypingEventProviderImpl(this.client);
    this.eyesSender = new EyesSender(this.typingEvent, random, logger);
  }

  public start(): void {
    if (this.client === undefined || this.typingEvent === undefined || this.eyesSender === undefined) {
      throw Error("Please invoke `build()` before `start()`.");
    }

    const env = new EnvironmentLoader();
    env.load();
    this.eyesSender.settings = {
      hitPercent: env.getFloatValue("EYES_HIT_PERCENT"),
      requireSilenceTime: env.getFloatValue("EYES_REQUIRE_SILENCE_TIME"),
      minStandByTime: env.getFloatValue("EYES_MIN_STAND_BY_TIME"),
      maxStandByTime: env.getFloatValue("EYES_MAX_STAND_BY_TIME")
    };
    this.client.token = env.getValue("DISCORD_TOKEN");

    this.client.initialize();
    this.typingEvent.initialize();
    this.eyesSender.initialize();
    void this.client.login();
  }
}
