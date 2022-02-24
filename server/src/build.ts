import { EyesSender } from "./models/eyes";
import { RandomSourceImpl } from "./adapters/random";
import { TypingEventProviderImpl } from "./adapters/typing";
import { DiscordClient } from "./adapters/client";
import { EnvironmentLoader } from "./environment";

export class ServerBuilder {
  private client: DiscordClient | undefined;
  private typingEvent: TypingEventProviderImpl | undefined;
  private eyesSender: EyesSender | undefined;

  public build(): void {
    this.client = new DiscordClient();
    this.typingEvent = new TypingEventProviderImpl(this.client);
    const random = new RandomSourceImpl();
    this.eyesSender = new EyesSender(this.typingEvent, random);
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

    this.typingEvent.initialize();
    this.eyesSender.registerEvent();
    void this.client.login();
  }
}
