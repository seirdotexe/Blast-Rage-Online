# Todo

- Start working on some database stuff
- Some sort of system that'll decode packet params and then pass them through the callback
  - Requires a lot of JSDOC work

# API

GET `http://api.xgenstudios.com/?method=xgen.users.add&username=&password=&email_address=&v=2`
Content-Type:"text/xml"
```xml
<?xml version="1.0" encoding="utf-8" ?><rsp stat="fail">
	<err code="4" msg="Username already exists" />
</rsp>

<?xml version="1.0" encoding="utf-8" ?><rsp stat="ok">
	<user id="0" />
</rsp>
```