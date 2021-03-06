import { Channel, DiscordError } from "../models/eyes";
import { DiscordAPIError, TextBasedChannel as RawTextBasedChannelChannel } from "discord.js";
import { DiscordClient } from "./client";

export class ChannelImpl implements Channel {
  public constructor(private readonly raw: RawTextBasedChannelChannel, public readonly client: DiscordClient) {}

  public async getLastMessageSentAt(): Promise<Date | undefined> {
    const channel = await this.client.fetchTextChannel(this.raw.id);

    let result;
    try {
      result = await channel.messages.fetch({ limit: 1 });
    } catch (error) {
      if (error instanceof DiscordAPIError) throw new DiscordError();
      throw error;
    }

    const lastMessage = result.first();
    if (lastMessage === undefined) return undefined;
    return lastMessage.createdAt;
  }

  public async send(content: string): Promise<void> {
    try {
      await this.raw.send(content);
    } catch (error) {
      if (error instanceof DiscordAPIError) throw new DiscordError();
      throw error;
    }
  }
}
