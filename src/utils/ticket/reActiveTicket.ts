import { TextChannel, Permissions, MessageEmbed } from "discord.js";
import { createActiveButton } from "../../components/buttons/createActiveButton";
import { CONFIG } from "../config";

async function reActiveTicket(interaction, { user, guild, role }) {
  var ticketChannel = interaction.client.channels.cache.get(
    interaction.channel.id
  ) as TextChannel;

  var memberID = ticketChannel.name.split("-")[1];

  await ticketChannel.edit({
    name: `active-${memberID}`,
    parent: CONFIG.ID.channels.ticketCategoryId,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: role,
        allow: [
          Permissions.FLAGS.SEND_MESSAGES,
          Permissions.FLAGS.VIEW_CHANNEL,
        ],
      },
      {
        id: memberID,
        allow: [
          Permissions.FLAGS.VIEW_CHANNEL,
          Permissions.FLAGS.SEND_MESSAGES,
        ],
      },
    ],
  });

  await interaction.deferReply({ ephemeral: true });
  await interaction.followUp({
    content: `Yardım talebi tekrardan atkif edildi!`,
    ephemeral: true,
  });

  var filteredMessage = (
    await interaction.channel.messages.fetch({ limit: 100 })
  ).find((x) => x.author.id === interaction.client.user.id);

  var message = interaction.channel.messages.fetch(filteredMessage.id);
  var embed: MessageEmbed = new MessageEmbed()
    .setColor("#5865F2")
    .setTitle(guild.name)
    .setDescription(
      `Merhaba, <@${user.id}> bu talep tekrardan aktif edildi. Yetkili ekibimiz birazdan senin ile ilgilenecek.`
    )
    .addField(
      "*NOT*",
      "Talebi tekrardan arşivlemek için aşağıdaki **yeşil** düğmeyi kullanabilirsiniz eğer bu kanalı kalıcı olarak kapatmak istiyorsanız **kırmızı** düğmeyi kullanabilirsiniz"
    )
    .setTimestamp()
    .setFooter({
      text: `${guild.name}`,
    });

  (await message).edit({
    embeds: [embed],
    components: [createActiveButton()],
  });
}

export { reActiveTicket };
