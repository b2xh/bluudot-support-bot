import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  Formatters,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import { createLogger } from "bunyan";
import { CONFIG } from "./utils/config";
import { Ticket } from "./extensions/ticket";
import { reActiveTicket } from "./utils/ticket/reActiveTicket";
import { archivingTicket } from "./utils/ticket/archivingTicket";
import { Shop } from "./extensions/shop";
import { Starboard } from "./extensions/starboard";
import modals from "discord-modals";
import ms from "ms";

class Core extends Client {
  public logger = createLogger({ name: "MAIN-LOGS" });
  public ticket: Ticket;
  public shop: Shop;
  public starboard: Starboard;

  public constructor() {
    super({
      intents: CONFIG.CORE.intents,
      presence: {
        activities: CONFIG.CORE.activities,
      },
    });
    modals(this);
    this.ticket = new Ticket({ core: this });
    this.shop = new Shop({ core: this });
    this.starboard = new Starboard({ core: this });
  }

  public async handleEvents() {
    await this.on("interactionCreate", this.slashCommandsCallback);
    await this.on("interactionCreate", this.ticket.handleTicketButton);
    await this.on("interactionCreate", this.shop.handleSelectMenu);
    await this.on("modalSubmit", this.ticket.handleTicketModal);
    await this.on("messageCreate", this.sendCommand);
    await this.on("interactionCreate", this.handleButtons);
    await this.on("ready", this.onReady);
    await this.on("messageCreate", this.starboard.addReactions);
    await this.on("messageCreate", this.commandsCallback);
  }

  public async commandsCallback(message: Message) {
    var prefix = CONFIG.CORE.prefix;

    if (!message.content.startsWith(prefix)) return;
    if (!message.content.includes(" ")) return;

    var commandName = message.content.slice(prefix.length).trim().split(" ")[0];
    var args = message.content.slice(prefix.length).trim().split(" ").slice(1);

    if (commandName === "t") {
      if (!message.member.roles.cache.has(CONFIG.ID.roles.moderatorRoleId)) {
        return;
      }

      var user = args[0];
      var time = args.slice(1).join(" ");
      var reason = `Moderatör: ${message.author.id}`;

      if (!user) return;
      var member = message.guild.members.cache.get(user);
      if (!member) return;
      if (member.id === message.author.id) return;
      if (!time) return;
      if (!member.manageable) return;

      await message.reply({
        content: `**${member.user.tag}** kullanıcısı <@${message.author.id}> tarafından susturuldu **[Zaman: ${time}]**`,
      });

      await member.timeout(ms(time));
    } else if (commandName === "b") {
      if (!message.member.roles.cache.has(CONFIG.ID.roles.adminRoleId)) {
        return;
      }

      var user = args[0];
      var reason = `Moderatör: ${message.author.id}`;

      if (!user) return;
      var member = message.guild.members.cache.get(user);
      if (!member) return;
      if (member.id === message.author.id) return;

      if (!member.bannable) return;

      await message.reply({
        content: `**${member.user.tag}** kullanıcısı <@${message.author.id}> tarafından yasaklandı`,
      });

      await member.ban({
        reason,
      });
    }
  }

  public rulesButton() {
    var channel = this.channels.cache.get(CONFIG.ID.channels.rulesChannelId);
    var content = CONFIG.MESSAGES.filter((x) => x.name === "rules-messages")[0];
    var message = content.messages.map((x) => x).join("\n\n");

    if (channel.isText()) {
      channel.send({
        content: message,
        components: [
          new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId("rules-button")
              .setLabel("Kuralları okudum ve kabul ediyorum")
              .setStyle("SUCCESS"),
          ]),
        ],
      });
    }
  }

  public async handleButtons(event: ButtonInteraction) {
    var channel = this.channels.cache.get(event.channel.id) as TextChannel;
    var type = channel.name.split("-")[0];
    var role = CONFIG.ID.roles.helperRoleId;

    if (event.isButton()) {
      if (event.customId === "arsiv") {
        await archivingTicket(event, {
          user: event.user,
          guild: event.guild,
          role: role,
        });
      } else if (event.customId === "aktifet") {
        await reActiveTicket(event, {
          user: event.user,
          guild: event.guild,
          role: role,
        });
      } else if (event.customId === "kapat") {
        if (!event.memberPermissions.has("KICK_MEMBERS")) {
          await event.deferReply({ ephemeral: true });
          await event.followUp({
            content: `Yeterli yetkiniz bulunmuyor.`,
            ephemeral: true,
          });
          return;
        }
        event.reply({
          content: `Bu talep **5** saniye icerisinde kalıcı olarak kaldırılacak.`,
        });
        var ticketChannel = event.guild.channels.cache.get(event.channel.id);
        setTimeout(async () => {
          await ticketChannel.delete();
          return;
        }, 5000);
      } else if (event.customId === "rules-button") {
        var IMember = event.guild.members.cache.get(event.member.user.id);

        if (IMember.manageable) {
          if (!IMember.roles.cache.get(CONFIG.ID.roles.guildMemberRoleId)) {
            await IMember.roles.add(CONFIG.ID.roles.guildMemberRoleId);
            await event.reply({
              content: "Başarıyla sunucuya kayıt oldun.",
              ephemeral: true,
            });
            return;
          } else {
            await event.reply({
              content: "Zaten sunucuya kayıtlısın",
              ephemeral: true,
            });
            return;
          }
        } else {
          await event.reply({
            content: "Bir hata oluştu lütfen yetkililere bildir.",
            ephemeral: true,
          });
        }
      }
    }
  }

  public async sendCommand(event: Message) {
    if (event.author.id !== CONFIG.ID.developerId) return;
    if (!event.content.startsWith("!send")) return;

    var args = event.content.split(" ").slice(1);
    var arg = args[0];

    if (arg) {
      if (arg.toLowerCase() === "ticket") {
        await this.ticket.sendTicketMessage();
      } else if (arg.toLocaleLowerCase() === "shop") {
        await this.shop.sendShopMessage();
      } else if (arg.toLowerCase() === "rules") {
        await this.rulesButton();
      }
    }
  }

  public async onReady(core: Core) {
    this.logger.info(core.user.username + " system is ready!");
    var commands = [
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
                choices: CONFIG.CHOICES,
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
                choices: CONFIG.CHOICES,
              },
            ],
          },
        ],
      },
    ];
    await this.application.commands.set(commands).then((cmd) => {
      this.logger.info(cmd.size + " size command created.");
    });
  }

  public async init() {
    await this.login(CONFIG.CORE.token);
    await this.handleEvents();
  }

  public async slashCommandsCallback(i: CommandInteraction) {
    if (i.isCommand()) {
      if (i.commandName === "role") {
        var user = i.options.get("user").user.id;
        var member: GuildMember = i.guild.members.cache.get(user);

        var role = i.options.get("role").value;
        var roleID: string = CONFIG.ID.roles[`${role.toString()}RoleId`];
        var Imember: GuildMember = i.guild.members.cache.get(i.user.id);
        var args: string = i.options.getSubcommand(true);

        if (!Imember.roles.cache.has(CONFIG.ID.roles.moderatorRoleId)) {
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

new Core().init();

export { Core };
