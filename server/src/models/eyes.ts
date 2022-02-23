import { sleepAsync } from "../helper/time";

export class EyesSender {
  public static messageContent = ":eye: :eye:";

  public constructor(
    public readonly typingEvent: TypingEventProvider,
    public readonly random: RandomSource,
    public readonly settings: SendEyesSettingsProvider
  ) {}

  public registerEvent(): void {
    this.typingEvent.onTrigger((e) => this.attemptToSendEyes(e), { allowBot: false });
  }

  public async attemptToSendEyes(typing: Typing): Promise<void> {
    if (!this.isHit()) return;
    console.log(`[1] HIT`);
    await this.standByRandomTime();
    console.log(`[2] RANDOM`);
    if (!this.isConditionOK(typing)) return;
    console.log(`[3] SILENCE`);
    await this.sendMessage(typing.channel);
  }

  private isHit(): boolean {
    return this.random.getRandomNormalized() < this.settings.hitPercent;
  }

  private async standByRandomTime(): Promise<void> {
    const quietTime = this.random.getRandomInteger(this.settings.minStandByTime, this.settings.maxStandByTime);
    await sleepAsync(quietTime);
  }

  private isConditionOK(typing: Typing): boolean {
    return new ChannelConditionChecker(typing.channel, this.settings).isConditionMatched();
  }

  private async sendMessage(channel: Channel): Promise<void> {
    await channel.send(EyesSender.messageContent);
  }
}

class ChannelConditionChecker {
  public constructor(public readonly channel: Channel, public readonly settings: SendEyesSettingsProvider) {}

  public isConditionMatched(): boolean {
    return this.isSilenceEnough();
  }

  private isSilenceEnough(): boolean {
    const lastMessageSentAt = this.channel.getLastMessageSentAt();
    if (lastMessageSentAt === undefined) return true;
    const silenceTime = lastMessageSentAt.getTime() - Date.now();
    return silenceTime >= this.settings.requireSilenceTime;
  }
}

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
  getLastMessageSentAt(): Date | undefined;
}

export interface SendEyesSettingsProvider {
  hitPercent: number;
  requireSilenceTime: number;
  minStandByTime: number;
  maxStandByTime: number;
}
