import { TextChannel, Permissions, MessageEmbed } from "discord.js";
import { CONFIG } from "../config";
import { createActiveButton } from "../createButtons";

async function reActiveTicket(interaction, { type, user, guild, role }) {
  var ticketChannel = interaction.client.channels.cache.get(
    interaction.channel.id
  ) as TextChannel;

  var memberID = ticketChannel.name.split("-")[1];
  await ticketChannel.edit({
    name: `active-${memberID}`,
    parent: CONFIG.support.category,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: role,
        allow: [Permissions.FLAGS.SEND_MESSAGES],
      },
      {
        id: memberID,
        allow: [Permissions.FLAGS.VIEW_CHANNEL],
      },
    ],
  });

  await interaction.deferReply({ ephemeral: true });
  interaction.followUp({
    content: `Yardım talebi tekrardan atkif edildi!`,
    ephemeral: true,
  });

  var filteredMessage = (
    await interaction.channel.messages.fetch({ limit: 100 })
  ).find((x) => x.author.id === interaction.client.user.id);

  var message = interaction.channel.messages.fetch(filteredMessage.id);

  const embed: MessageEmbed = new MessageEmbed()
    .setColor("#5865F2")
    .setDescription(
      `Merhaba, <@${user.id}> bu talep tekrardan aktif edildi.\n\nYetkili ekibimiz birazdan senin ile ilgilenecek.`
    )
    .addField(
      "*NOT*",
      "Talebi tekrardan arşivlemek için aşağıdaki **yeşil** düğmeyi kullanabilirsiniz eğer bu kanalı kalıcı olarak kapatmak istiyorsanız **kırmızı** düğmeyi kullanabilirsiniz"
    )
    .setTimestamp()
    .setFooter({
      text: `${guild.name} |`,
    });

  (await message).edit({
    embeds: [embed],
    components: [createActiveButton()],
  });
}

export { reActiveTicket };
