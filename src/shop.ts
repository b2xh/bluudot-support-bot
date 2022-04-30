import {
  Formatters,
  Message,
  MessageEmbed,
  TextChannel,
  Permissions,
} from "discord.js";
import { Main } from "./main";
import { CONFIG } from "./utils/config";
import { createShopMenu } from "./utils/shop/createShopMenu";
import { createActiveButton } from "./utils/createButtons";

class Shop {
  public client: Main;
  public constructor(client: Main) {
    this.client = client;
  }

  public async createShopMessage() {
    this.client.on("messageCreate", async (message: Message) => {
      if (message.content === "!sendShopMessage") {
        var embed = new MessageEmbed()
          .setColor("#5865F2")
          .setTitle("Bluudot Shop 🛒")
          .setDescription(
            `Merhaba, aşağıda bulunan menüde sizin için ekibimiz tarafından yapabileceğimiz hizmetler bulunuyor. Merak etmeyin hizmetlerimiz bunlar ile sınırlı olmayacak zamanla çoğalacaktır. 🤠`
          )
          .addField(
            "Biz kimiz?",
            `Biz çeşitli açık kaynak kodlu yazılımlar geliştiren ve projeler yapan bunun yanı sıra çeşitli tasarımlar çizen bir ekibiz.`
          )
          .addFields([
            {
              name: "Nasıl satın alırım.",
              value:
                "Aşağıda bulunan menüden istediginiz hizmeti seçtikten sonra sizin içi oluşturulan kanal da **Satış yetkililerimiz** ile özel bir şekilde görüşebilirsiniz.",
            },
          ])
          .setTimestamp()
          .setFooter({
            text: `${message.guild.name} Shop 🛒 |`,
          });
        await message.channel.send({
          embeds: [embed],
          components: [createShopMenu()],
        });
      }
    });
  }

  public handleShopMenu() {
    this.client.on("interactionCreate", async (i) => {
      if (i.isSelectMenu()) {
        if (i.customId === "shop-menu") {
          var key = i.values[0];

          var embed = new MessageEmbed()
            .setColor("#5865F2")
            .setTitle("Bluudot Shop 🛒")
            .setDescription(
              `Hey, <@${
                i.user.id
              }> **${key.toLocaleUpperCase()}** hakkında yeni bir hizmet satış talebi oluşturdu. Birazdan satış yetkilileri sizinle ilgilenecek *bizi tercih etiğiniz için Teşekkürler*.`
            )
            .addField("Talep sebebi", Formatters.codeBlock(key.toUpperCase()))
            .setTimestamp()
            .setFooter({
              text: `${i.guild.name} Shop 🛒 |`,
            });

          var channel = (await i.guild.channels.create(`shop-${i.user.id}`, {
            parent: CONFIG.support.category,
            reason: `Shop Channel ${i.user.username} - ${i.user.id}`,
            permissionOverwrites: [
              {
                id: i.guild.roles.everyone.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL],
              },
              {
                id: i.user.id,
                allow: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ],
              },
              {
                id: CONFIG.shop.mods,
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
              },
            ],
          })) as TextChannel;

          channel.send({
            content: `<@${i.user.id}> - <@&${CONFIG.shop.mods}>`,
            embeds: [embed],
            components: [createActiveButton()],
          });

          if (!i.replied) {
            await i.reply({
              content: `Hey <@${i.user.id}>, senin için bir satış talebi oluşturdum. İşte; <#${channel.id}>`,
              ephemeral: true,
            });
          }
        }
      }
    });
  }
}

export { Shop };
