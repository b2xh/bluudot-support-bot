import { createLogger } from "bunyan";
import { ModalSubmitInteraction, showModal } from "discord-modals";
import {
  MessageEmbed,
  TextChannel,
  Interaction,
  CacheType,
  MessageButton,
  MessageActionRow,
  Message,
  Formatters,
} from "discord.js";
import { Main } from "./main";
import { createSupportChannel } from "./utils/support/createSupportChannel";
import { createSupportModal } from "./utils/support/createSupportModal";
import { CONFIG } from "./utils/config";
import { createActiveButton } from "./utils/createButtons";

type TSupportSystem = {
  client: Main;
};

class SupportController {
  public client: Main;
  public logger = createLogger({ name: "SUPPORT-LOGS" });

  public constructor({ client }: TSupportSystem) {
    this.client = client;
  }

  public async supportEmbed() {
    var channel = this.client.channels.cache.get(CONFIG.support.channel);

    var embed: MessageEmbed = new MessageEmbed()
      .setTitle("Yeni bir yardım talebi oluştur")
      .setColor("#5865F2")
      .setDescription(
        "Bir yardım talebi oluşturmak için aşağıdaki düğmeyi kullabilirsiniz. Alt kısımda daha açıklayıcı bir metin bulunuyor. Okumayı unutma!"
      )
      .addFields([
        {
          name: "Nasıl yardım talebi oluştururum?",
          value: `Aşağıdaki **Talep oluştur** düğmesine bastıktan sonra karışına cıkan form'da bulunan soruları dolduruyorsunuz ve talep oluşturma süreciniz başarıyla tamamlanmış oluyor. Sizin adınıza oluşturulan kanaldan yardım alabilirsiniz.`,
        },
        {
          name: "*NOT!*",
          value:
            "Gereksiz talep oluşturan kullanıcılarda moderatörlerin *ceza uygulama* yetkisi bulunmaktadır!",
        },
      ])
      .setTimestamp()
      .setFooter({ text: "Bluudot.gg support system (br1s)" });
    const row: MessageActionRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("talep_olustur")
        .setLabel("Talep oluştur!")
        .setStyle("PRIMARY")
    );

    if (channel.isText()) {
      return channel.send({ embeds: [embed], components: [row] });
    }
  }

  public rulesButton() {
    var rulesMesssage = `Bluudot'a hoş geldiniz!\n\n**Sunucu Kuralları**\n**1.** Discord Topluluk Kuralları'na uyun. (https://discord.com/terms)\n**2.** Cinsel içerikler paylaşmayın veya göndermelerini yapmayın.\n**3.** Ölüm, yaralama ve zarar verici konuları bulundurmayın.\n**4.** Yasa dışı, çalma veya hackleme gibi konuları bulundurmayın.\n**5.** Dil, din, ırk ayrımı yapmayın ve herkese saygıyla yaklaşın.\n**6.** Herhangi birisini ifşalamayın, kötülemeyin veya aşağılamayın.\n**7.** Spam, flood, küfür, gereksiz spoiler veya aşırı caps kullanmayın.\n**8.** Epileptik emojiler veya profil resimlerinin bulunmasını istemiyoruz.\n**9.** Rolleri veya üyeleri gereksiz/spam amaçlı etiketlemeyin.\n**10.** Hiçbir platformun/hesabınızın reklamını yapmayın.\n**11.** Siyaset, tarafçılık veya ayrımcılık yapmak yasaktır.`;
    var message = `**Davranışlarınızı Değerlendirin**\n**1.** Rahatsız olacağınız davranışları yansıtmayın ve buna dikkat edin.\n**2.** Devamlı olarak yanlış bilgi paylaşıp insanları kandırmayı amaçlamayın.\n**3.** Sürekli birisine veya toplu arkadaşlık isteği yollamayın.\n**4.** Minimod'luk yani yetkili olmadan yetkili gibi uyarı vermek veya karar koymak yasaktır.`;
    var note1 = `*Yetkililerimiz kural ihlaline bağlı olarak gerekli cezayı uygulayabilir. Burada belirtilmemiş olup sunucu düzenini bozacak davranışlar yasaktır. Buradan itibaren yukarıdaki kuralları kabul etmiş sayılacaksınız.*`;
    var note2 = `Kayıt sağlamak ve kanalları görüntüleyip sohbet etmeye başlamak için yukardaki **"Düğmeye"** basınız.`;

    var allMessage = `${rulesMesssage}\n\n${message}\n\n\n${note1}\n\n${note2}`;

    var channel = this.client.channels.cache.get("966058095442800702");

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

  public async handleButtonComponents(interaction: Interaction<CacheType>) {
    if (interaction.isButton()) {
      if (interaction.customId === "talep_olustur") {
        if (
          interaction.guild.channels.cache.find((x) =>
            x.name.includes(interaction.user.id)
          )
        ) {
          return interaction.reply({
            content: "Hey! Zaten bir yardım kanalın bulunuyor.",
            ephemeral: true,
          });
        }

        showModal(createSupportModal(), {
          client: interaction.client,
          interaction: interaction,
        });
      }
    }
  }

  public async handleModal(modal: ModalSubmitInteraction) {
    if (modal.customId === "support-modal") {
      var createdChannel = (await createSupportChannel(modal)) as TextChannel;
      var ticketReason = modal.getTextInputValue("support-modal-reason");

      var embed = new MessageEmbed()
        .setTitle(`${modal.user.tag} yeni bir talep oluşturdu`)
        .setColor("#5865F2")
        .setDescription(
          `Merhaba, **${modal.user.username}** talep oluşturduğun için teşekkürler. Yetkili ekibimiz birazdan senin ile ilgilenecek.`
        )
        .addFields([
          {
            name: "Talep açılma sebebi:",
            value: Formatters.codeBlock("markdown", ticketReason),
          },
          {
            name: "*NOT!*",
            value: `Talebi tekrardan arşivlemek için aşağıdaki **yeşil** düğmeyi kullanabilirsiniz eğer bu kanalı kalıcı olarak kapatmak istiyorsanız **kırmızı** düğmeyi kullanabilirsiniz`,
          },
        ])
        .setTimestamp()
        .setFooter({
          text: `${modal.guild.name} |`,
        });

      await createdChannel.send({
        embeds: [embed],
        content: `<@${modal.user.id}> - <@&${CONFIG.support.mods}>`,
        components: [createActiveButton()],
      });
      await modal.deferReply({ ephemeral: true });
      modal.followUp({
        content: `Hey! senin için yardım alabileceğin bir kanal oluşturdum; <#${createdChannel.id}>`,
        ephemeral: true,
      });
      this.logger.info(
        `New ticket created; ${modal.user.tag} - (${modal.user.id}) [${createdChannel.name}]`
      );
    }
  }

  sendSupportEmbed() {
    this.client.on("messageCreate", (message: Message) => {
      if (message.content === "!sendSupportEmbed") {
        // this.supportEmbed();
      }
      return;
    });
  }
}

export { SupportController };
