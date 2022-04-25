import { Formatters, MessageEmbed } from "discord.js";

class SupportControllerChatLogger {
  created({ username, reason }) {
    const embed = new MessageEmbed()
      .setTitle("Yeni bir talep oluşturuldu.")
      .setColor("#5865F2")
      .setDescription(
        `**${username}** adlı kullanıcı yeni bir talep oluşturdu.`
      )
      .addField(
        "Talep açılma sebebi:",
        Formatters.codeBlock("markdown", reason)
      )
      .setTimestamp()
      .setFooter({ text: "Bluudot.gg support system (br1s)" });

    return { embed };
  }

  deleted({ username, reason, messages, deletedUsername }) {
    const embed = new MessageEmbed()
      .setTitle("Bir talep arşivlendi.")
      .setColor("#5865F2")
      .setDescription(
        `**${username}** adlı kullanıcının talebi ${deletedUsername} tarafından arşivlendi.`
      )
      .addField(
        "Talep açılma sebebi:",
        Formatters.codeBlock("markdown", reason)
      )
      .setTimestamp()
      .setFooter({ text: "Bluudot.gg support system (br1s)" });

    return { embed };
  }
}

export { SupportControllerChatLogger };
