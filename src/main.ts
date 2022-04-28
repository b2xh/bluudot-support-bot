import { Client, MessageEmbed, TextChannel } from "discord.js";
import { createLogger } from "bunyan";
import { SupportController } from "./support";
import { CONFIG } from "./utils/config";
import { Shop } from "./shop";
import { archivingTicket } from "./utils/support/archivingTicket";
import { reActiveTicket } from "./utils/support/reActiveTicket";
import modals from "discord-modals";

class Main extends Client {
  public logger = createLogger({ name: "MAIN-LOGS" });
  public supportController: SupportController;
  public shop: Shop;

  public constructor() {
    super({
      intents: ["GUILDS", "GUILD_MESSAGES"],
      presence: {
        activities: [
          {
            name: CONFIG.game.name,
            type: CONFIG.game.type,
          },
        ],
      },
    });
    this.supportController = new SupportController({ client: this });
    this.shop = new Shop(this);
    modals(this);
  }

  public handleButtons() {
    this.on("interactionCreate", async (i) => {
      var channel = this.channels.cache.get(i.channel.id) as TextChannel;
      var type = channel.name.split("-")[0];
      var role = type === "shop" ? CONFIG.shop.mods : CONFIG.support.mods;
      console.log(type);

      if (i.isButton()) {
        if (i.customId === "arsiv") {
          await archivingTicket(i, {
            user: i.user,
            guild: i.guild,
            role,
          });
        } else if (i.customId === "aktifet") {
          await reActiveTicket(i, {
            user: i.user,
            guild: i.guild,
            type: type,
            role: role,
          });
        } else if (i.customId === "kapat") {
          if (!i.memberPermissions.has("KICK_MEMBERS")) {
            await i.deferReply({ ephemeral: true });
            i.followUp({
              content: `Yeterli yetkiniz bulunmuyor.`,
              ephemeral: true,
            });
            return;
          }
          i.reply({
            content: `Bu talep **5** saniye icerisinde kalıcı olarak kaldırılacak.`,
          });
          setTimeout(async () => {
            await i.channel.delete();
            return;
          }, 5000);

          this.logger.info(
            `${type.replace(
              type.charAt(0),
              type.charAt(0).toUpperCase()
            )} ticket removed; ${i.user.tag} - (${i.user.id}) [${i.channel.id}]`
          );
        }
      }
    });
  }

  public async init() {
    await this.login(CONFIG.token);
    await this.on("modalSubmit", this.supportController.handleModal);
    await this.on("ready", () => {
      this.logger.info("BLUUDOT.gg support system is ready! (coded by br1s)");
      this.application.commands
        .create({
          name: "sub",
          description: "Abone rolü almanızı sağlayan komutur.",
          options: [
            {
              name: "user",
              type: 6,
              description: "Kullanıcı secersiniz",
              required: true,
            },
          ],
        })
        .then(() => {
          this.logger.info("SUB command created.");
        });
    });
    await this.on(
      "interactionCreate",
      this.supportController.handleButtonComponents
    );
    await this.shop.handleShopMenu();
    await this.handleButtons();
    await this.on("interactionCreate", async (i) => {
      if (i.isCommand()) {
        if (i.commandName === "sub") {
          var user = i.options.get("user").user.id;
          var member = i.guild.members.cache.get(user);
          var IMember = i.guild.members.cache.get(i.user.id);

          if (!IMember.roles.cache.has(CONFIG.subController[0])) {
            await i.reply({
              content: "Bu komutu kullanmak için yeterli yetkin bulunmuyor.",
              ephemeral: true,
            });
            return;
          }

          if (member.roles.cache.has(CONFIG.subRole)) {
            await i.reply({
              content: "Zaten abone rolüne sahipsin.",
              ephemeral: true,
            });
            return;
          }

          await member.roles.add(CONFIG.subRole);
          await i.reply({
            content: `:tada: <@${user}> kullanıcısına <@${i.user.id}> tarafından abone rolü başarıyla verildi.`,
            ephemeral: false,
          });
        }
      }
    });
    await this.shop.createShopMessage();
    await this.supportController.sendSupportEmbed();
  }
}

new Main().init();

export { Main };
