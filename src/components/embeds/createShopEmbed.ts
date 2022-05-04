import { MessageEmbed } from "discord.js";

function createShopEmbed() {
  return {
    embed: new MessageEmbed()
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
      .setColor("#5865F2")
      .setTimestamp()
      .setFooter({ text: `bluudot.net` }),
  };
}

export { createShopEmbed };
