import { sleepAsync } from "../helper/time";

export class EyesSender {
  public static messageContent = ":eye: :eye:";
  public settings: SendEyesSettingsProvider | undefined;

  public constructor(public readonly typingEvent: TypingEventProvider, public readonly random: RandomSource) {}

  public registerEvent(): void {
    this.typingEvent.onTrigger((e) => this.attemptToSendEyes(e), { allowBot: false });
  }

  public async attemptToSendEyes(typing: Typing): Promise<void> {
    try {
      if (!this.isHit()) return;
      await this.standByRandomTime();
      if (!(await this.isSilenceEnough(typing))) return;
      await this.sendMessage(typing.channel);
    } catch (error) {
      if (error instanceof DiscordError) return;
      console.error(error);
    }
  }

  private isHit(): boolean {
    if (this.settings === undefined) {
      throw Error("`settings` is undefined.");
    }

    return this.random.getRandomNormalized() < this.settings.hitPercent;
  }

  private async standByRandomTime(): Promise<void> {
    if (this.settings === undefined) {
      throw Error("`settings` is undefined.");
    }

    const quietTime = this.random.getRandomInteger(this.settings.minStandByTime, this.settings.maxStandByTime);
    await sleepAsync(quietTime);
  }

  private async isSilenceEnough(typing: Typing): Promise<boolean> {
    if (this.settings === undefined) {
      throw Error("`settings` is undefined.");
    }

    const lastMessageSentAt = await typing.channel.getLastMessageSentAt();
    if (lastMessageSentAt === undefined) return true;
    const silenceTime = Date.now() - lastMessageSentAt.getTime();
    return silenceTime >= this.settings.requireSilenceTime;
  }

  private async sendMessage(channel: Channel): Promise<void> {
    await channel.send(EyesSender.messageContent);
  }
}

export class DiscordError {}

export type TypingEventHandler = (typing: Typing) => PromiseLike<void>;
export type TypingEventOptions = {
  allowBot: boolean;
};

export interface TypingEventProvider {
  onTrigger(handler: TypingEventHandler, options?: TypingEventOptions): void;
}

export interface RandomSource {
  getRandomNormalized(): number;
  getRandomInteger(min: number, max: number): number;
}

export interface Typing {
  channel: Channel;
}

export interface Channel {
  send(content: string): Promise<void>;
  getLastMessageSentAt(): PromiseLike<Date | undefined>;
}

export interface SendEyesSettingsProvider {
  hitPercent: number;
  requireSilenceTime: number;
  minStandByTime: number;
  maxStandByTime: number;
}
