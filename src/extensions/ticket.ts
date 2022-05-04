import { ModalSubmitInteraction, showModal } from "discord-modals";
import { ButtonInteraction, TextChannel } from "discord.js";
import { Core } from "../core";
import { createActiveButton } from "../components/buttons/createActiveButton";
import { createTicketButton } from "../components/buttons/createTicketButton";
import { CONFIG } from "../utils/config";
import { createdTicketEmbed } from "../components/embeds/createdTicketEmbed";
import { createTicketModal } from "../components/modals/createTicketModal";
import { createTicketChannel } from "../utils/ticket/createTicketChannel";
import { createTicketEmbed } from "../components/embeds/createTicketEmbed";

class Ticket {
  public core: Core;

  constructor({ core }) {
    this.core = core;
  }

  public async sendTicketMessage() {
    var ticketChannelId = CONFIG.ID.channels.ticketChannelId;
    var ticketChannel = await this.core.channels.cache.get(ticketChannelId);

    var { embed } = createTicketEmbed();

    if (ticketChannel.isText()) {
      await ticketChannel.send({
        embeds: [embed],
        components: [createTicketButton()],
      });
    }
  }

  public async handleTicketButton(event: ButtonInteraction) {
    if (event.isButton()) {
      if (event.customId === "talep-olustur") {
        if (
          event.guild.channels.cache.find((x) => x.name.includes(event.user.id))
        ) {
          await event.reply({
            content: `Hey <@${event.user.id}>, bir yardım kanalın bulunuyor zaten.`,
            ephemeral: true,
          });
          return;
        }
        showModal(createTicketModal(), {
          client: event.client,
          interaction: event,
        });
      }
    }
  }

  public async handleTicketModal(event: ModalSubmitInteraction) {
    if (event.customId === "ticket-modal") {
      var createdChannel = (await createTicketChannel({
        guild: event.guild,
        user: event.user,
        categoryId: CONFIG.ID.channels.ticketCategoryId,
        roleId: CONFIG.ID.roles.helperRoleId,
      })) as TextChannel;

      var ticketReason = event.getTextInputValue("ticket-modal-reason");
      var { embed } = createdTicketEmbed({
        user: event.user,
        guild: event.guild,
        ticketReason,
      });

      await createdChannel.send({
        embeds: [embed],
        content: `<@${event.user.id}> - <@&${CONFIG.ID.roles.helperRoleId}>`,
        components: [createActiveButton()],
      });
      await event.deferReply({ ephemeral: true });
      event.followUp({
        content: `Hey <@${event.user.id}>, senin için yardım alabileceğin bir kanal oluşturdum; <#${createdChannel.id}>`,
        ephemeral: true,
      });
    }
  }
}

export { Ticket };
