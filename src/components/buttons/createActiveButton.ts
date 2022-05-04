import { MessageActionRow, MessageButton } from "discord.js";

function createActiveButton() {
  const row: MessageActionRow = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("arsiv")
      .setLabel("Arşivle")
      .setStyle("SUCCESS"),
    new MessageButton()
      .setCustomId("kapat")
      .setLabel("Kalıcı olarak kapat.")
      .setStyle("DANGER"),
  ]);

  return row;
}

export { createActiveButton };
