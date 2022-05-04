import { Guild, User, Permissions } from "discord.js";

interface ICreateChannelOptions {
  guild: Guild;
  user: User;
  categoryId: string;
  roleId: string;
}

async function createTicketChannel({
  guild,
  user,
  categoryId,
  roleId,
}: ICreateChannelOptions) {
  var createdChannel = await guild.channels.create(`ticket-${user.id}`, {
    parent: categoryId,
    reason: `${user.tag} - ${user.id}`,
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
        id: roleId,
        allow: [Permissions.FLAGS.VIEW_CHANNEL],
      },
    ],
  });

  return createdChannel;
}

export { createTicketChannel };
