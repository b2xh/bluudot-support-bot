import { Modal, TextInputComponent } from "discord-modals";

function createTicketModal() {
  const modal: Modal = new Modal()
    .setCustomId("ticket-modal")
    .setTitle("Talep Oluştur")
    .addComponents(
      new TextInputComponent()
        .setCustomId("ticket-modal-reason")
        .setLabel("Talep oluşturma sebebi")
        .setStyle("LONG")
        .setMinLength(10)
        .setMaxLength(480)
        .setPlaceholder("Sebep")
        .setRequired(true)
    );
  return modal;
}

export { createTicketModal };
