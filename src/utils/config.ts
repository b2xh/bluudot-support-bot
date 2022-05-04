import { config } from "dotenv";
import { BitFieldResolvable, ExcludeEnum, IntentsString } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
config();

const CONFIG = {
  CORE: {
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
      sharesChannelIds: ["971456668720316436"],
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
      label: "Discord Supervisor Bot (170₺)",
      description:
        "Discord Supervisor bot hizmeti için bir talep oluşturursunuz.",
      value: "discord-supervisor-bot",
    },
    {
      label: "Level 1 Discord Afiş (30₺)",
      description:
        "Level 1 Discord Afiş hizmeti için bir talep oluşturursunuz.",
      value: "level-1-discord-afiş",
    },
    {
      label: "Level 2 Discord Afiş (60₺)",
      description:
        "Level 2 Discord Afiş hizmeti için bir talep oluşturursunuz.",
      value: "level-2-discord-afiş",
    },
    {
      label: "Level 3 Discord Afiş (90₺)",
      description:
        "Level 3 Discord Afiş hizmeti için bir talep oluşturursunuz.",
      value: "level-3-discord-afiş",
    },
    {
      label: "Level 4 Discord Afiş (140₺)",
      description:
        "Level 3 Discord Afiş hizmeti için bir talep oluşturursunuz.",
      value: "level-4-discord-afiş",
    },
    {
      label: "Oyun Sistemleri",
      description: "Oyun Sistemleri hizmeti için bir talep oluşturursunuz.",
      value: "oyun-sistemleri",
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
};

export { CONFIG };
