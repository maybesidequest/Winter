export const discordService = {
  async getChannelName(_channelId: string): Promise<string | null> {
    throw new Error("Discord channel discovery belongs to the Control Plane");
  },
};
