# Interesting methods

1. `_SafePkg_41._SafeCls_40` - Cipher class
2. `_SafePkg_8._SafeCls_71._SafeStr_154` - Send function
3. `this.mmocha._SafeStr_154` - Sending packets
4. `public function toString() : String` - This wraps up an obfuscated packet to send to the server
5. `_SafePkg_20._SafeCls_39` - Obfuscated opcodes
6. `protected function _SafeStr_1141` - Receiving regular packets
7. `_SafePkg_8._SafeCls_67` - Receiving packets event names
8. `_SafeStr_342` - Gives you mod and gets set in the handshake packet
9. `this.ed.notification_box._SafeStr_108` - Messages to the player in UI box along with `error_messages`

# Authentication

```
Called from _SafeStr_789 and will start listening for _SafeStr_776 and _SafeStr_814

public static const _SafeStr_209:String = "Authenticate";
case "A":
  _loc5_ = _loc2_.substr(1,3); <- param4 _SafeStr_203 (mmocha _SafeStr_145) some sort of mmocha ID
  _loc6_ = _loc2_.substr(4); <- rest of the packet data
  this._SafeStr_169(new _SafeCls_67(_SafeCls_67._SafeStr_209,false,false,_loc5_,_loc6_));

_SafeStr_776 handles messages while logging in:
092 - Email validation prompt
09b - Game version out of date
093 - Name change required due to conflict
091 - Temp ban
095 - Duplicate login
09  - Incorrect credentials (unofficial packet but is in else loop last)

_SafeStr_814 is odd, seems to prepare some UI but does set this class called _SafeCls_3 which seems like current player class storage

var _loc2_:_SafeCls_3 = _SafeCls_3._SafeStr_157();
_loc2_.username = this.ed._SafeStr_117.username;
_loc2_.password = this.ed._SafeStr_117.password;
_loc2_._SafeStr_1019 = int(param1.message.charAt(param1.message.length - 1)); <- no clue, 0 use in source

This code above is only used for a JS call to GameLogin using ExternalInterface which doesn't exist, seems like dev code (dev user Murray May with user id 8060894)
ExternalInterface.call("GameLogin",_loc2_.username,_SafeCls_11._SafeStr_806(_loc2_.password));

What's important is: this._SafeStr_1216(param1.message.substr(param1.message.indexOf("|") + 1)); <- Removes the username
_SafeStr_1216 parses the response from the server upon valid login, once again calls _SafeCls_3._SafeStr_157

_SafeStr_1216 — loads the initial user data from the TCP packet. Here, ships are parsed and put into _SafeStr_127 and the loadout
_SafeStr_1077 — loads the user's items through HTTP
_SafeStr_1113 — loads the user's ships through HTTP
_SafeStr_1216 parses ship records from the TCP packet, while _SafeStr_1113 parses ship records from the HTTP response. Both use _SafeCls_5._SafeStr_632() to create the ship objects
The TCP packet contains the ship data, and the HTTP xgen.blastrage.user.tanks.list response contains the exact same ship data
_SafeCls_3._SafeStr_157() returns a singleton, so all three functions operate on the same _SafeCls_3 object unless it is explicitly reset
Therefore, the ships are effectively loaded twice: first from TCP, then again from HTTP, with the HTTP ship list replacing the TCP ship list

Since HTTP will always be sent, the ship data in the TCP packet appears unnecessary. It appears the devs had always used HTTP calls but then later on implemented retrieving ships through TCP and kept them both in for a later migration point.

Right after everything is loaded in, the client will allow new events

this.ed._SafeStr_117._SafeStr_250();
this.mmocha._SafeStr_790("_"); <- Join room
this.ed.notification_box._SafeStr_197();
this.ed._SafeStr_147._SafeStr_764(this.ed,this.mmocha);
this.ed._SafeStr_147.addEventListener(_SafeCls_66._SafeStr_504,this._SafeStr_686); <- Logout
this.ed._SafeStr_147.addEventListener(_SafeCls_66._SafeStr_336,this._SafeStr_564); <- Quick Start
this.ed._SafeStr_147.addEventListener(_SafeCls_66._SafeStr_324,this._SafeStr_957); <- Join Game
this.ed._SafeStr_147.addEventListener(_SafeCls_66._SafeStr_373,this._SafeStr_990); <- Create Game
```

# Room joining

```
After receiving the authentication packet, having loaded all items and ships (_SafeStr_1113) it'll call this.mmocha._SafeStr_790("_")
This'll send to the server 03_ so I suppose _ means lobby

_SafeStr_790 = attempt to join room
_SafeStr_402 = room name in mmocha class
_SafeStr_957 = join game which gives us new events

this._SafeStr_156.addEventListener(_SafeCls_66._SafeStr_337,this._SafeStr_522); <- Error out
this._SafeStr_156.addEventListener(_SafeCls_66._SafeStr_218,this._SafeStr_558); <- Leave

```

# Hand shake

```
public static const _SafeStr_359:String = "Hand Shake";

case "U":
  _loc5_ = _loc2_.substr(1,3);
  _loc6_ = _loc2_.substr(4);
  this._SafeStr_169(new _SafeCls_67(_SafeCls_67._SafeStr_359,false,false,_loc5_,_loc6_));

Called in _SafeCls_49._SafeStr_407 to _SafeStr_492 which seems for lobby
Also called in _SafeCls_102._SafeStr_1164 to _SafeStr_492 which seems for round

U
  MmochaID
  #username#
  _SafeStr_342 (1/0 mod)
  encoded integer for rank
```