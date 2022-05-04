import { Message } from "discord.js";
import { Core } from "../core";
import { CONFIG } from "../utils/config";

class Starboard {
  public core: Core;

  constructor({ core }) {
    this.core = core;
  }

  public addReactions(event: Message) {
    var up = "971124414269771796";
    var down = "971124403842723890";

    if (CONFIG.ID.channels.sharesChannelIds.includes(event.channelId)) {
      if (event.attachments.size !== 0) {
        event.react(up);
        event.react(down);
      }
    }
  }
}

export { Starboard };
