import { Modal, TextInputComponent } from "discord-modals";

function createShopModal(type: string) {
  const modal: Modal = new Modal()
    .setCustomId("shop-modal")
    .setTitle("Bluudot Shop")
    .addComponents(
      new TextInputComponent()
        .setCustomId("shop-description")
        .setLabel(`${type} hakkında bilgi verir misin?`)
        .setStyle("LONG")
        .setMinLength(10)
        .setMaxLength(480)
        .setPlaceholder("Açıklama")
        .setRequired(true)
    );
  return modal;
}

export { createShopModal };
