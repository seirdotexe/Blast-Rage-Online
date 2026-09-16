# Blast Rage Online

A server emulator for the MMO game Blast Rage Online.

🎯 The goal of this project is to preserve the MMO game Blast Rage Online from XGen Studios.

# Requirements and installation

Requires Node V24 and up and PostgreSQL.

1. Download the repo and unzip it
2. Open terminal, cd to the unzipped directory, and install all modules using `npm i`
3. In the same terminal, run the command `npm run start`

# Playing the game

Because Adobe Flash support has ceased to be supported, your only option is to create an Electron client, or use Pale Moon. The latter is the easiest.

1. Download Pale Moon [here](https://www.palemoon.org/download.php?mirror=eu&bits=64&type=7z)
2. Extract it and create a new directory inside `palemoon-34.3.2.win64\palemoon` called **plugins**
3. Download `NPSWF64_32_0_0_371.dll` from [here](https://github.com/dreamcentury/webbrowser-flash) and place it in the plugins folder
4. In Pale Moon, go to `about:config` and set `plugins.load_appdir_plugins` to **true**
5. Flash should now be activated in `about:plugins`

⚠️ Due to copyright, I won't be able to include the game files.

# License & Copyright

This project applies the BSD-3-Clause license. This project aims to preserve this game. I'm not entitled in any sort of way on claiming copyright on it. All of the credit goes to Robyn Dubuc & XGen Studios. I'm not affiliated with them.