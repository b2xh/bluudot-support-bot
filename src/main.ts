import {
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { createLogger } from "bunyan";
import { SupportController } from "./support";
import { CONFIG } from "./utils/config";
import modals from "discord-modals";

class Main extends Client {
  public logger = createLogger({ name: "MAIN-LOGS" });
  public supportController: SupportController;

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
    modals(this);
  }

  // public async reactionRole(
  //   reaction: MessageReaction | PartialMessageReaction,
  //   user: User | PartialUser
  // ) {
  //   if (reaction.emoji.name === "💡") {
  //     if (reaction.message.id === "967161868378595368") {
  //       var member = reaction.message.guild.members.cache.get(user.id);

  //       if (member.roles.cache.has("966059487238705175")) {
  //         await reaction.remove();
  //       } else {
  //         await member.roles.add("966059487238705175");
  //       }
  //     }
  //   }
  // }

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
    // await this.supportController.sendSupportEmbed();
  }
}

new Main().init();

export { Main };
