import { Channel } from "../models/eyes";
import { TextBasedChannel as RawChannel } from "discord.js";

export class ChannelImpl implements Channel {
  public constructor(private readonly raw: RawChannel) {}

  public getLastMessageSentAt(): Date | undefined {
    const lastMessage = this.raw.lastMessage;
    if (lastMessage === null) return undefined;
    return lastMessage.createdAt;
  }

  public async send(content: string): Promise<void> {
    await this.raw.send(content);
  }
}
