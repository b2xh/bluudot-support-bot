import { MessageActionRow, MessageButton } from "discord.js";

function createTicketButton() {
  const createTicketButton: MessageActionRow =
    new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("talep-olustur")
        .setLabel("Yeni bir yardım talebi oluştur!")
        .setStyle("SUCCESS")
    );

  return createTicketButton;
}
export { createTicketButton };
