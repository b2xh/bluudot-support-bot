import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import { createLogger } from "bunyan";
import { CONFIG } from "./utils/config";
import modals from "discord-modals";
import { Ticket } from "./extensions/ticket";
import { reActiveTicket } from "./utils/ticket/reActiveTicket";
import { archivingTicket } from "./utils/ticket/archivingTicket";
import { Shop } from "./extensions/shop";
import { Starboard } from "./extensions/starboard";

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
    await this.on("interactionCreate", this.commandsCallback);
    await this.on("interactionCreate", this.ticket.handleTicketButton);
    await this.on("interactionCreate", this.shop.handleSelectMenu);
    await this.on("modalSubmit", this.ticket.handleTicketModal);
    await this.on("messageCreate", this.messageCommands);
    await this.on("interactionCreate", this.handleButtons);
    await this.on("ready", this.onReady);
    await this.on("messageCreate", this.starboard.addReactions);
    // await this.on("messageReactionAdd", this.starboard.controlReactions);
  }

  public rulesButton() {
    var rulesMesssage = `Bluudot'a hoş geldiniz!\n\n**Sunucu Kuralları**\n**1.** Discord Topluluk Kuralları'na uyun. (https://discord.com/terms)\n**2.** Cinsel içerikler paylaşmayın veya göndermelerini yapmayın.\n**3.** Ölüm, yaralama ve zarar verici konuları bulundurmayın.\n**4.** Yasa dışı, çalma veya hackleme gibi konuları bulundurmayın.\n**5.** Dil, din, ırk ayrımı yapmayın ve herkese saygıyla yaklaşın.\n**6.** Herhangi birisini ifşalamayın, kötülemeyin veya aşağılamayın.\n**7.** Spam, flood, küfür, gereksiz spoiler veya aşırı caps kullanmayın.\n**8.** Epileptik emojiler veya profil resimlerinin bulunmasını istemiyoruz.\n**9.** Rolleri veya üyeleri gereksiz/spam amaçlı etiketlemeyin.\n**10.** Hiçbir platformun/hesabınızın reklamını yapmayın.\n**11.** Siyaset, tarafçılık veya ayrımcılık yapmak yasaktır.`;
    var message = `**Davranışlarınızı Değerlendirin**\n**1.** Rahatsız olacağınız davranışları yansıtmayın ve buna dikkat edin.\n**2.** Devamlı olarak yanlış bilgi paylaşıp insanları kandırmayı amaçlamayın.\n**3.** Sürekli birisine veya toplu arkadaşlık isteği yollamayın.\n**4.** Minimod'luk yani yetkili olmadan yetkili gibi uyarı vermek veya karar koymak yasaktır.`;
    var note1 = `*Yetkililerimiz kural ihlaline bağlı olarak gerekli cezayı uygulayabilir. Burada belirtilmemiş olup sunucu düzenini bozacak davranışlar yasaktır. Buradan itibaren yukarıdaki kuralları kabul etmiş sayılacaksınız.*`;
    var note2 = `Kayıt sağlamak ve kanalları görüntüleyip sohbet etmeye başlamak için yukardaki **"Düğmeye"** basınız.`;

    var allMessage = `${rulesMesssage}\n\n${message}\n\n\n${note1}\n\n${note2}`;

    var channel = this.channels.cache.get(CONFIG.ID.channels.rulesChannelId);

    if (channel.isText()) {
      channel.send({
        content: allMessage,
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

  public async messageCommands(event: Message) {
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

  public async commandsCallback(i: CommandInteraction) {
    if (i.isCommand()) {
      if (i.commandName === "role") {
        var user = i.options.get("user").user.id;
        var member: GuildMember = i.guild.members.cache.get(user);

        var role = i.options.get("role").value;
        var roleID = CONFIG.ID.roles[`${role.toString()}RoleId`];
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
