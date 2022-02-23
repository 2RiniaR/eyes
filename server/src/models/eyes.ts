import { sleepAsync } from "../helper/time";

export class EyesSender {
  public static messageContent = ":eye: :eye:";

  public constructor(public readonly typingEvent: TypingEventProvider, public readonly random: RandomSource) {}

  public registerEvent(): void {
    this.typingEvent.onTrigger((e) => this.attemptToSendEyes(e), { allowBot: false });
  }

  public async attemptToSendEyes(typing: Typing): Promise<void> {
    if (!this.isHit()) return;
    await this.waitRandomTime();
    if (!this.isConditionOK(typing)) return;
    await this.sendMessage(typing.channel);
  }

  private isHit(): boolean {
    return this.random.getRandomInteger(0, 100) < 10;
  }

  private async waitRandomTime(): Promise<void> {
    const quietTime = this.random.getRandomInteger(5000, 10000);
    await sleepAsync(quietTime);
  }

  private isConditionOK(typing: Typing): boolean {
    return new ChannelConditionChecker(typing.channel).isConditionMatched();
  }

  private async sendMessage(channel: Channel): Promise<void> {
    await channel.send(EyesSender.messageContent);
  }
}

class ChannelConditionChecker {
  public static requireSilenceTime = 50000;

  public constructor(public readonly channel: Channel) {}

  public isConditionMatched(): boolean {
    return this.isSilenceEnough();
  }

  private isSilenceEnough(): boolean {
    const silenceTime = this.channel.getLastMessageSentAt().getTime() - Date.now();
    return silenceTime >= ChannelConditionChecker.requireSilenceTime;
  }
}

export type TypingEventHandler = (typing: Typing) => PromiseLike<void>;
export type TypingEventOption = {
  allowBot: boolean;
};

export interface TypingEventProvider {
  onTrigger(handler: TypingEventHandler, options?: TypingEventOption): void;
}

export interface RandomSource {
  getRandomInteger(min: number, max: number): number;
}

export interface Typing {
  channel: Channel;
}

export interface Channel {
  send(content: string): Promise<void>;
  getLastMessageSentAt(): Date;
}
