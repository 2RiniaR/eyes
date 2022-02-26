import { Channel } from "../models/eyes";
import { TextBasedChannel as RawTextBasedChannelChannel } from "discord.js";
import { DiscordClient } from "./client";

export class ChannelImpl implements Channel {
  public constructor(private readonly raw: RawTextBasedChannelChannel, public readonly client: DiscordClient) {}

  public async getLastMessageSentAt(): Promise<Date | undefined> {
    const channel = await this.client.fetchTextChannel(this.raw.id);
    const result = await channel.messages.fetch({ limit: 1 });
    const lastMessage = result.first();
    if (lastMessage === undefined) return undefined;
    return lastMessage.createdAt;
  }

  public async send(content: string): Promise<void> {
    await this.raw.send(content);
  }
}
