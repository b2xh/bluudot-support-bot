import { TextChannel, Permissions, MessageEmbed } from "discord.js";
import { CONFIG } from "../config";
import { createAgainActiveButton } from "../../components/buttons/createAgainActiveButton";

async function archivingTicket(interaction, { user, guild, role }) {
  var ticketChannel = interaction.client.channels.cache.get(
    interaction.channel.id
  ) as TextChannel;

  var memberID = ticketChannel.name.split("-")[1];
  await ticketChannel.edit({
    name: `arsiv-${memberID}`,
    parent: CONFIG.ID.channels.archiveCategoryId,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: role,
        deny: [Permissions.FLAGS.SEND_MESSAGES],
      },
      {
        id: memberID,
        deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
    ],
  });

  await interaction.deferReply({ ephemeral: true });
  interaction.followUp({
    content: `Bu talep başarıyla arşivlendi!`,
    ephemeral: true,
  });

  var filteredMessage = (
    await interaction.channel.messages.fetch({ limit: 100 })
  ).find((x) => x.author.id === interaction.client.user.id);

  var message = interaction.channel.messages.fetch(filteredMessage.id);

  const embed: MessageEmbed = new MessageEmbed()
    .setColor("#5865F2")
    .setTitle(guild.name)
    .setDescription(`Hey! Bu talep <@${user.id}> tarafından arşivlendi!`)
    .addField(
      "*NOT*",
      "Talebi tekrar aktif etmek için aşağıdaki **yeşil** düğmeyi kullanabilirsiniz eğer bu kanalı kalıcı olarak kapatmak istiyorsanız **kırmızı** düğmeyi kullanabilirsiniz"
    )
    .setTimestamp()
    .setFooter({
      text: `${guild.name}`,
    });

  (await message).edit({
    embeds: [embed],
    components: [createAgainActiveButton()],
  });
}

export { archivingTicket };
