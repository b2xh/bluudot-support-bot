import { MessageEmbed } from "discord.js";

function createTicketEmbed() {
  return {
    embed: new MessageEmbed()
      .setTitle("Yeni bir yardım talebi oluştur")
      .setDescription(
        "Bir yardım talebi oluşturmak için aşağıdaki düğmeyi kullabilirsiniz. Alt kısımda daha açıklayıcı bir metin bulunuyor. Okumayı unutma!"
      )
      .setColor("#5865F2")
      .addFields([
        {
          name: "Nasıl yardım talebi oluştururum?",
          value:
            "Aşağıdaki **Talep oluştur** düğmesine bastıktan sonra karışına cıkan form'da bulunan soruları dolduruyorsunuz ve talep oluşturma süreciniz başarıyla tamamlanmış oluyor. Sizin adınıza oluşturulan kanaldan yardım alabilirsiniz.",
        },
        {
          name: "*NOT!*",
          value:
            "Gereksiz talep oluşturan kullanıcılarda moderatörlerin *ceza uygulama* yetkisi bulunmaktadır!",
        },
      ])
      .setTimestamp()
      .setFooter({ text: `bluudot.net` }),
  };
}

export { createTicketEmbed };
