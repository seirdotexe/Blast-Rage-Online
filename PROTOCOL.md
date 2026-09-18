# Authentication

```
Called from _SafeStr_789 and will start listening for _SafeStr_776 and _SafeStr_814

public static const _SafeStr_209:String = "Authenticate";
case "A": <- obviously 0A
  _loc5_ = _loc2_.substr(1,3);
  _loc6_ = _loc2_.substr(4);
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

What's important is: this._SafeStr_1216(param1.message.substr(param1.message.indexOf("|") + 1));
_SafeStr_1216 parses the response from the server upon valid login, once again calls _SafeCls_3._SafeStr_157

var _loc3_:_SafeCls_3 = _SafeCls_3._SafeStr_157();
_loc3_.username = this.ed._SafeStr_117.username;
_loc3_._SafeStr_230 = parseInt(_loc2_[0]);
_loc3_._SafeStr_330 = parseInt(_loc2_[1]);
_loc3_.xcash = parseInt(_loc2_[2]);
_loc3_._SafeStr_173 = parseInt(_loc2_[3]); <- user id

```