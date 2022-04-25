import { MessageActionRow, MessageButton } from "discord.js";

function createActiveSupportButton() {
  const row: MessageActionRow = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("support-arsiv")
      .setLabel("Arşivle")
      .setStyle("SUCCESS"),
    new MessageButton()
      .setCustomId("support-kapat")
      .setLabel("Kalıcı olarak kapat.")
      .setStyle("DANGER"),
  ]);

  return row;
}

function createAgainActiveSupportButton() {
  const row: MessageActionRow = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("support-aktifet")
      .setLabel("Tekrardan aktif et")
      .setStyle("SUCCESS"),
    new MessageButton()
      .setCustomId("support-kapat")
      .setLabel("Kalıcı olarak kapat")
      .setStyle("DANGER"),
  ]);

  return row;
}

export { createAgainActiveSupportButton, createActiveSupportButton };
