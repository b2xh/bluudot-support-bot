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

  //   public async controlReactions(
  //     reaction: MessageReaction,
  //     user: User | PartialUser
  //   ) {
  //     var { message } = reaction;
  //     var reactionName = "👍";

  //     if (reaction.emoji.name !== reactionName) return;
  //     if (message.author.bot) return;

  //     // var bestDesignChannelId = CONFIG.ID.channels.bestDesignChannelId;
  //     // var bestDesignChannel = (await message.guild.channels.cache.get(
  //     //   bestDesignChannelId
  //     // )) as TextChannel;

  //     // var fetchedMessage = await bestDesignChannel.messages.fetch({ limit: 100 });

  //     // var embeds = fetchedMessage.filter((x) =>
  //     //   x.embeds[0].footer.text.startsWith(reactionName)
  //     // );

  //     // console.log(embeds);
  //   }
}

export { Starboard };
