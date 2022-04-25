import { ModalSubmitInteraction } from "discord-modals";
import { Permissions } from "discord.js";
import { CONFIG } from "../config";

async function createSupportChannel({ guild, user }: ModalSubmitInteraction) {
  const createdChannel = await guild.channels.create(`support-${user.id}}`, {
    parent: CONFIG.support.category,
    reason: "Support Channel (" + user.username + " - " + user.id + ")",
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: user.id,
        allow: [
          Permissions.FLAGS.VIEW_CHANNEL,
          Permissions.FLAGS.READ_MESSAGE_HISTORY,
        ],
      },
      {
        id: CONFIG.support.mods,
        allow: [Permissions.FLAGS.VIEW_CHANNEL],
      },
    ],
  });

  return createdChannel;
}

export { createSupportChannel };
