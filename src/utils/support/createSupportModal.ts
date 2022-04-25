import { Modal, TextInputComponent } from "discord-modals";

function createSupportModal() {
  const modal: Modal = new Modal()
    .setCustomId("support-modal")
    .setTitle("Talep Oluştur")
    .addComponents(
      new TextInputComponent()
        .setCustomId("support-modal-reason")
        .setLabel("Talep oluşturma sebebi")
        .setStyle("LONG")
        .setMinLength(10)
        .setMaxLength(480)
        .setPlaceholder("Sebep")
        .setRequired(true)
    );
  return modal;
}

export { createSupportModal };
