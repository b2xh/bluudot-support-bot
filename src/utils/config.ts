import { config } from "dotenv";
import { ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
config();

const CONFIG = {
  token: process.env.TOKEN,
  subRole: "967120105655894097",
  subController: ["966057444289687672", "966057439701110794"],
  support: {
    channel: "967117614033825842",
    logChannel: "966988156350103592",
    category: "966835658666684437",
    mods: "966057458529341440",
    arsiv: "967117790211346502",
  },
  game: {
    name: "bluudot server",
    type: "WATCHING" as ExcludeEnum<typeof ActivityTypes, "CUSTOM">,
  },
};

export { CONFIG };
