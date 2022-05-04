import { MessageActionRow, MessageButton } from "discord.js";

function createAgainActiveButton() {
  const row: MessageActionRow = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("aktifet")
      .setLabel("Tekrardan aktif et")
      .setStyle("SUCCESS"),
    new MessageButton()
      .setCustomId("kapat")
      .setLabel("Kalıcı olarak kapat")
      .setStyle("DANGER"),
  ]);

  return row;
}

export { createAgainActiveButton };
