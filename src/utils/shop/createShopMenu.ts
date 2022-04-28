import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { CONFIG } from "../config";

function createShopMenu() {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("shop-menu")
      .setPlaceholder("Henüz bir hizmet seçmedin")
      .addOptions(CONFIG.shop.options)
  );

  return row;
}

export { createShopMenu };
