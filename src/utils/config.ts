import { config } from "dotenv";
import { BitFieldResolvable, ExcludeEnum, IntentsString } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
config();

const CONFIG = {
  CORE: {
    prefix: `dot`,
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_MEMBERS",
      "GUILD_MESSAGE_REACTIONS",
    ] as BitFieldResolvable<IntentsString, number>,
    token: process.env.TOKEN,
    activities: [
      {
        name: "bluudot server",
        type: "WATCHING" as ExcludeEnum<typeof ActivityTypes, "CUSTOM">,
      },
    ],
  },
  ID: {
    developerId: "681547077662277719",
    guildId: "966045096074154004",
    roles: {
      adminRoleId: "971431075932954644",
      helperRoleId: "966057458529341440",
      moderatorRoleId: "966057444289687672",
      guildMemberRoleId: "966059487238705175",
      developerRoleId: "969589188532006912",
      designerRoleId: "969589184757117009",
      editorRoleId: "969589182299275284",
      customerRoleId: "966057477860904970",
    },
    channels: {
      rulesChannelId: "966058095442800702",
      sharesChannelIds: ["971079816306630656", "971079834467983430"],
      bestDesignChannelId: "",
      ticketChannelId: "967117614033825842",
      ticketCategoryId: "966835658666684437",
      shopChannelId: "971325990901014589",
      shopCategoryId: "966835658666684437",
      archiveCategoryId: "967117790211346502",
    },
  },
  OPTIONS: [
    {
      label: "Tasarım Hizmetleri",
      description: "Tasarım hizmeti için bir talep oluşturursunuz.",
      value: "tasarim-hizmetleri",
    },
    {
      label: "Yazılım Hizmetleri",
      description: "Yazılım hizmeti için bir talep oluşturursunuz.",
      value: "yazilim-hizmetleri",
    },
    {
      label: "Sosyal Medya Hizmetleri",
      description: "Sosyal Medya hizmeti için bir talep oluşturursunuz.",
      value: "sosyal-medya-hizmetleri",
    },
    {
      label: "Edit Hizmetleri",
      description: "Edit hizmeti için bir talep oluşturursunuz.",
      value: "edit-hizmetleri",
    },
  ],
  CHOICES: [
    {
      name: "Developer",
      value: "developer",
    },
    {
      name: "Designer",
      value: "designer",
    },
    {
      name: "Editor",
      value: "editor",
    },
    {
      name: "Customer",
      value: "customer",
    },
  ],
  MESSAGES: [
    {
      name: "shop-messages",
      messages: [
        "**Bluudot Shop 🛒**",
        "Merhaba, aşağıda bulunan menüde sizin için ekibimiz tarafından yapabileceğimiz hizmetler bulunuyor. Hizmetlerimiz bunlar ile sınırlı olmayacak ve zamanla çoğalacaktır.",
        "**Nasıl satın alırım?**\nAşağıda bulunan menüden istediginiz hizmeti seçtikten sonra sizin içi oluşturulan kanalda satış yetkililerimiz ile özel bir şekilde görüşebilirsiniz.",
      ],
    },
    {
      name: "ticket-messages",
      messages: [
        "**Yeni bir yardım talebi oluştur!** :ticket:",
        "Bir yardım talebi oluşturmak için aşağıdaki düğmeyi kullabilirsiniz. Alt kısımda daha açıklayıcı bir metin bulunuyor. Okumayı unutma!",
        "**Nasıl yardım talebi oluştururum?**\nAşağıdaki **Talep Oluştur** düğmesine basıp karşına çıkan formda bulunan soruları doldurduktan sonra talep oluşturma süreciniz başarıyla tamamlanmış oluyor. Sizin adınıza oluşturulan kanaldan yardım alabilirsiniz. ",
        "**NOT!**\nGereksiz talep oluşturan kullanıcılarda moderatörlerin ceza uygulama yetkisi bulunmaktadır!",
      ],
    },
    {
      name: "rules-messages",
      messages: [
        `Kayıt sağlamak ve kanalları görüntüleyip sohbet etmeye başlamak için aşağıdaki **"Düğmeye"** basınız.`,
      ],
    },
  ],
};

export { CONFIG };
