import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { CONFIG } from "../../utils/config";

function createShopMenu() {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("shop-menu")
      .setPlaceholder("Henüz bir hizmet seçmedin")
      .addOptions(CONFIG.OPTIONS)
  );

  return row;
}

export { createShopMenu };
