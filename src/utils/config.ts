import { config } from "dotenv";
import { ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
config();

const CONFIG = {
  token: process.env.TOKEN,
  subRole: "967120105655894097",
  subController: ["966057444289687672", "966057439701110794"],
  support: {
    channel: "969247607090212915",
    category: "969242672311201852",
    mods: "966832410027257948",
    arsiv: "969339517444173914",
  },
  shop: {
    category: "969344514768642188",
    mods: "969242759397539840",
    channel: "969225423340839022",
    options: [
      {
        label: "Discord Bot",
        description: "Discord bot hizmeti için bir talep oluşturursunuz.",
        value: "discord-bot",
      },
      {
        label: "WhatsApp Bot",
        description: "WhatsApp Bot hizmeti için bir talep oluşturursunuz.",
        value: "whatsapp-bot",
      },
      {
        label: "API Wrapper",
        description: "API Wrapper hizmeti için bir talep oluşturursunuz.",
        value: "api",
      },
      {
        label: "Website",
        description: "Website hizmeti için bir talep oluşturursunuz.",
        value: "website",
      },
      {
        label: "Discord Banner",
        description:
          "Discord Banner (Sunucu, Kullanıcı) hizmeti için bir talep oluşturursunuz.",
        value: "discord-banner",
      },
    ],
  },
  game: {
    name: "bluudot server",
    type: "WATCHING" as ExcludeEnum<typeof ActivityTypes, "CUSTOM">,
  },
};

export { CONFIG };
