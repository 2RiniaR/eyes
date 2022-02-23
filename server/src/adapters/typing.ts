import { Typing, TypingEventHandler, TypingEventOptions, TypingEventProvider } from "../models/eyes";
import { DiscordClient } from "./client";
import { Typing as RawTyping } from "discord.js";
import { ChannelImpl } from "./channel";

type Registration = {
  handler: TypingEventHandler;
  options: TypingEventOptions;
};

export class TypingEventProviderImpl implements TypingEventProvider {
  private readonly registrations: Registration[] = [];

  public constructor(public readonly client: DiscordClient) {}

  public initialize(): void {
    this.client.onTypingStarted((raw) => this.triggerHandlers(raw));
  }

  public onTrigger(handler: TypingEventHandler, options: TypingEventOptions = { allowBot: false }): void {
    this.registrations.push({ handler, options });
  }

  private async triggerHandlers(raw: RawTyping): Promise<void> {
    const typing = TypingEventProviderImpl.convertTyping(raw);
    await Promise.all(this.registrations.map((registration) => this.attemptTrigger(registration, raw, typing)));
  }

  private async attemptTrigger({ handler, options }: Registration, raw: RawTyping, typing: Typing) {
    if (!this.isBotCheckPassed(raw, options.allowBot)) return;
    await handler(typing);
  }

  private static convertTyping(raw: RawTyping): Typing {
    return { channel: new ChannelImpl(raw.channel) };
  }

  private isBotCheckPassed(raw: RawTyping, allowBot: boolean): boolean {
    return !raw.user.bot || allowBot;
  }
}
