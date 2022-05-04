import {
  Formatters,
  MessageEmbed,
  SelectMenuInteraction,
  Permissions,
  TextChannel,
} from "discord.js";
import { createActiveButton } from "../components/buttons/createActiveButton";
import { createShopEmbed } from "../components/embeds/createShopEmbed";
import { createShopMenu } from "../components/menu/createShopMenu";
import { Core } from "../core";
import { CONFIG } from "../utils/config";

class Shop {
  public core: Core;

  constructor({ core }) {
    this.core = core;
  }

  public async sendShopMessage() {
    var shopChannelId: string = CONFIG.ID.channels.shopChannelId;
    var shopChannel = await this.core.channels.cache.get(shopChannelId);
    var { embed } = await createShopEmbed();

    if (shopChannel.isText()) {
      await shopChannel.send({
        embeds: [embed],
        components: [createShopMenu()],
      });
    }
  }

  public async handleSelectMenu(event: SelectMenuInteraction) {
    if (event.isSelectMenu()) {
      if (event.customId === "shop-menu") {
        var key = event.values[0];

        var embed = new MessageEmbed()
          .setColor("#5865F2")
          .setTitle("Bluudot Shop 🛒")
          .setDescription(
            `Hey, <@${
              event.user.id
            }> **${key.toLocaleUpperCase()}** hakkında yeni bir hizmet satış talebi oluşturdu. Birazdan satış yetkilileri sizinle ilgilenecek *bizi tercih etiğiniz için Teşekkürler*.`
          )
          .addField("Talep sebebi", Formatters.codeBlock(key.toUpperCase()))
          .setTimestamp()
          .setFooter({
            text: `${event.guild.name} Shop 🛒 |`,
          });

        var channel = (await event.guild.channels.create(
          `shop-${event.user.id}`,
          {
            parent: CONFIG.ID.channels.shopCategoryId,
            reason: `Shop Channel ${event.user.username} - ${event.user.id}`,
            permissionOverwrites: [
              {
                id: event.guild.roles.everyone.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL],
              },
              {
                id: event.user.id,
                allow: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ],
              },
              {
                id: CONFIG.ID.roles.helperRoleId,
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
              },
            ],
          }
        )) as TextChannel;

        channel.send({
          content: `<@${event.user.id}> - <@&${CONFIG.ID.roles.helperRoleId}>`,
          embeds: [embed],
          components: [createActiveButton()],
        });

        if (!event.replied) {
          await event.reply({
            content: `Hey <@${event.user.id}>, senin için bir satış talebi oluşturdum. İşte; <#${channel.id}>`,
            ephemeral: true,
          });
        }
      }
    }
  }
}

export { Shop };
