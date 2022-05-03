import {
  Client,
  CommandInteraction,
  GuildMember,
  TextChannel,
} from "discord.js";
import { createLogger } from "bunyan";
import { SupportController } from "./support";
import { CONFIG } from "./utils/config";
// import { Shop } from "./shop";
import { archivingTicket } from "./utils/support/archivingTicket";
import { reActiveTicket } from "./utils/support/reActiveTicket";
import modals from "discord-modals";

class Main extends Client {
  public logger = createLogger({ name: "MAIN-LOGS" });
  public supportController: SupportController;
  // public shop: Shop;

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
    // this.shop = new Shop(this);
    modals(this);
  }

  public handleButtons() {
    this.on("interactionCreate", async (i) => {
      var channel = this.channels.cache.get(i.channel.id) as TextChannel;
      var type = channel.name.split("-")[0];
      // var role = type === "shop" ? CONFIG.shop.mods : CONFIG.support.mods;

      if (i.isButton()) {
        if (i.customId === "arsiv") {
          await archivingTicket(i, {
            user: i.user,
            guild: i.guild,
            role: CONFIG.support.mods,
          });
        } else if (i.customId === "aktifet") {
          await reActiveTicket(i, {
            user: i.user,
            guild: i.guild,
            type: type,
            role: CONFIG.support.mods,
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

          var ticketChannel = i.guild.channels.cache.get(i.channel.id);
          setTimeout(async () => {
            await ticketChannel.delete();
            return;
          }, 5000);

          this.logger.info(
            `Ticket removed; ${i.user.tag} - (${i.user.id}) [${i.channel.id}]`
          );
        }
      }
    });
  }

  public async init() {
    await this.login(CONFIG.token);
    await this.on("modalSubmit", this.supportController.handleModal);
    await this.on("ready", async () => {
      this.logger.info("BLUUDOT.gg support system is ready! (coded by br1s)");
      var commands = [
        // {
        //   name: "sub",
        //   description: "Abone rolü almanızı sağlayan komutur.",
        //   options: [
        //     {
        //       name: "user",
        //       type: 6,
        //       description: "Kullanıcı değeri",
        //       required: true,
        //     },
        //   ],
        // },
        {
          name: "role",
          description:
            "Bir kullanıcıya rol ekleyip kaldırmanızı sağlayan komutdur.",
          options: [
            {
              name: "add",
              type: 1,
              description: "Bir kullanıcıya belirtilen rolü eklersiniz.",
              options: [
                {
                  name: "user",
                  type: 6,
                  description: "Kullanıcı değeri",
                  required: true,
                },
                {
                  name: "role",
                  type: 3,
                  description: "Rol değeri",
                  required: true,
                  choices: CONFIG.commands.choices,
                },
              ],
            },
            {
              name: "remove",
              type: 1,
              description: "Bir kullanıcıya belirtilen rolü kaldırırsınız.",
              options: [
                {
                  name: "user",
                  type: 6,
                  description: "Kullanıcı değeri",
                  required: true,
                },
                {
                  name: "role",
                  type: 3,
                  description: "Rol değeri",
                  required: true,
                  choices: CONFIG.commands.choices,
                },
              ],
            },
          ],
        },
      ];
      await this.application.commands.set(commands).then((cmd) => {
        this.logger.info(cmd.size + " size command created.");
      });
    });
    await this.on(
      "interactionCreate",
      this.supportController.handleButtonComponents
    );
    // await this.shop.handleShopMenu();
    await this.handleButtons();
    await this.on("interactionCreate", this.commandsCallback);
    await this.supportController.sendSupportEmbed();
    // await this.shop.createShopMessage();
  }

  public async commandsCallback(i: CommandInteraction) {
    if (i.isCommand()) {
      // if (i.commandName === "sub") {
      //   var user = i.options.get("user").user.id;
      //   var member = i.guild.members.cache.get(user);
      //   var IMember = i.guild.members.cache.get(i.user.id);

      //   if (!IMember.roles.cache.has(CONFIG.subController)) {
      //     await i.reply({
      //       content: "Bu komutu kullanmak için yeterli yetkin bulunmuyor.",
      //       ephemeral: true,
      //     });
      //     return;
      //   }

      //   await member.roles.add(CONFIG.subRole);
      //   await i.reply({
      //     content: `:tada: <@${user}> kullanıcısına <@${i.user.id}> tarafından abone rolü başarıyla verildi.`,
      //     ephemeral: false,
      //   });
      // } else
      if (i.commandName === "role") {
        var user = i.options.get("user").user.id;
        var member: GuildMember = i.guild.members.cache.get(user);

        var role = i.options.get("role").value;
        var roleID = CONFIG.commands.roles[role.toString()];
        var interactionMember: GuildMember = i.guild.members.cache.get(
          i.user.id
        );

        var args: string = i.options.getSubcommand(true);

        if (!interactionMember.roles.cache.has(CONFIG.support.mods)) {
          await i.reply({
            content: "Bu komutu kullanmak için yeterli yetkin bulunmuyor.",
            ephemeral: true,
          });
          return;
        }

        if (args === "add") {
          if (member.manageable) {
            await member.roles.add(roleID);
            await i.reply({
              content: `:tada: <@${member.id}> kullanıcısına <@${i.user.id}> tarafından **${role}** rolü başarıyla verildi.`,
              ephemeral: false,
            });
          } else {
            await i.reply({
              content: `**${member.user.username}** kullanıcısını yönetemiyorum. Yeterli yetkim bulunmuyor.`,
              ephemeral: true,
            });
          }
        } else if (args === "remove") {
          if (member.manageable) {
            if (member.roles.cache.has(roleID)) {
              await member.roles.remove(roleID);
              await i.reply({
                content: `:cowboy: <@${member.id}> kullanıcısına <@${i.user.id}> tarafından **${role}** rolü kaldırırıldı.`,
                ephemeral: false,
              });
            } else {
              await i.reply({
                content: `**${member.user.username}** kullanıcısında zaten **${role}** rolü bulunmuyor.`,
                ephemeral: true,
              });
            }
          } else {
            await i.reply({
              content: `**${member.user.username}** kullanıcısını yönetemiyorum. Yeterli yetkim bulunmuyor.`,
              ephemeral: true,
            });
          }
        }
      }
    }
  }
}

new Main().init();

export { Main };
