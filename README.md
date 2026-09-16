# Blast Rage Online

A server emulator for the MMO game Blast Rage Online.

🎯 The goal of this project is to preserve the MMO game Blast Rage Online (version public6b) from XGen Studios.

![Game title screen](media/general/game.png)

# Requirements and installation

📝 Requires Node ^24 and PostgreSQL ^18.

1. Download the repo and unzip it
2. Open terminal, cd to the unzipped directory, and install all modules using `npm i`
3. Gather the game files and drop them in **src/public**
4. Edit the settings.ini servers array and point it towards your own server
5. In the same terminal, run the command `npm run start`

❓ A single instance of the game server alongside a web server will start up.

# Playing the game

Because support for Adobe Flash has ceased, your only options are to create an Electron client, or use Pale Moon. The latter is the easiest.

1. Download Pale Moon [here](https://www.palemoon.org/download.php?mirror=eu&bits=64&type=7z)
2. Extract it and create a new directory inside `palemoon-34.3.2.win64\palemoon` called **plugins**
3. Download `NPSWF64_32_0_0_371.dll` from [here](https://github.com/dreamcentury/webbrowser-flash) and place it in the plugins folder
4. In Pale Moon, go to `about:config` and set `plugins.load_appdir_plugins` to **true**
5. Flash should now be activated in `about:plugins`

⚠️ Due to copyright, I won't be able to include the game files. They're easy to find on Archive.org.

# Required P-code changes to the SWF

📝 Requires JPEXS ^26.

### Remove domain lock

The game is domain locked, a classic DRM in Flash games. In the main class of the game, it'll check the domain.
> if(_SafeCls_10._SafeStr_968("xgenstudios.com",this) || _SafeCls_10._SafeStr_968("blastrage.com",this))

![Showcase DRM Domain 1](media/drm/domain1.png)

You can easily patch out this check by always returning true in the function `public static function _SafeStr_968(param1:String, param2:MovieClip) : Boolean`.

![Showcase DRM Domain 2](media/drm/domain2.png)

Select the function name, click the button to edit the P-code and modify the **code** block to only this:

```
code
   pushtrue
   returnvalue
```

![Showcase DRM Domain 3](media/drm/domain3.png)

### Funky server settings

There appears to be some sort of bug going on when it comes to having a predefined server by default. The game does retrieve all servers but just never sets them. Instead it'll use **dev.mmocha.com** which is already set on `_SafeStr_519`. I suppose you're better off changing this variable to your IP. I just ignored this and went over it quickly. There's also a secret event somewhere that you can trigger that'll change the port to 1139.

### Sniffing packet

The developers made a silly obfuscation where the client will include **0bquitsniffing** before quick play and the login packet. This is meant to hide packets and get in your way. This string is defined in variable `_SafeStr_829`.

First find where it's used before sending login:

![Showcase DRM Packet 1](media/drm/packet1.png)

And where it's used before quick play:

![Showcase DRM Packet 2](media/drm/packet2.png)

Select the function name, click the button to edit the P-code, find `callpropvoid QName(PackageNamespace(""),"61"), 1`.

![Showcase DRM Packet 3](media/drm/packet3.png)

Replace it with `pop` and add another entry `pop`.

![Showcase DRM Packet 4](media/drm/packet4.png)

This results in the call being disabled.

![Showcase DRM Packet 5](media/drm/packet5.png)

You'll have to do that for both of the functions.

# License & Copyright

This project applies the BSD-3-Clause license. This project aims to preserve this game. I'm not entitled in any sort of way on claiming copyright on it. All of the credit goes to Robyn Dubuc & XGen Studios. I'm not affiliated with them.