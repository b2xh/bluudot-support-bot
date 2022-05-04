import { Formatters, MessageEmbed } from "discord.js";

function createdTicketEmbed({ user, guild, ticketReason }) {
  return {
    embed: new MessageEmbed()
      .setTitle(`${user.tag} yeni bir talep oluşturdu`)
      .setColor("#5865F2")
      .setDescription(
        `Merhaba, **${user.username}** talep oluşturduğun için teşekkürler. Yetkili ekibimiz birazdan senin ile ilgilenecek.`
      )
      .addFields([
        {
          name: "Talep açılma sebebi:",
          value: Formatters.codeBlock("markdown", ticketReason),
        },
        {
          name: "*NOT!*",
          value: `Talebi tekrardan arşivlemek için aşağıdaki **yeşil** düğmeyi kullanabilirsiniz eğer bu kanalı kalıcı olarak kapatmak istiyorsanız **kırmızı** düğmeyi kullanabilirsiniz`,
        },
      ])
      .setTimestamp()
      .setFooter({
        text: `${guild.name}`,
      }),
  };
}

export { createdTicketEmbed };
