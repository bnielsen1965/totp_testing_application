const FS = require("fs");
const Path = require("path");
const HTTP = require("http");
const Express = require("express");
const BodyParser = require("body-parser");
const OTPAuth = require("otpauth");
const QRCode = require("qrcode");

const Config = require("./config.js");

// create a secret from the configured UTF8 secret phrase
let secret = OTPAuth.Secret.fromUTF8(Config.totpSecretUTF8);
// create the TOTP authenticator with the config and secret
let totp = new OTPAuth.TOTP(Object.assign({}, Config.totp, { secret }));
// get the setup URI string
let uri = totp.toString();
// create the img tag qr code data string from the setup uri
let qrcode;
QRCode.toDataURL(uri, { version: 9 }, (error, url) => {
	qrcode = url;
});

// create http server application
let app = Express();
let server = HTTP.createServer(app);

// add parsers to http server application
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// add http server route to get authenticator application details
app.get("/api/details", (req, res) => {
	res.json({
    type: "TOTP",
    digits: Config.totp.digits,
    algorithm: Config.totp.algorithm,
    interval: Config.totp.period,
    secret: secret.base32,
    uri
   });
});

// add http server route to get qr code data string for img tag
app.get("/api/qrcode", (req, res) => {
	res.json({ qrcode });
});

// add http server route to accept authentication request
app.post("/api/auth", (req, res) => {
  let valid = totp.validate({ token: req.body.token, window: 1 })
	res.json({ valid: !(valid === null) });
});

// add http server static content hosting
let staticPath = Path.resolve(Config.http.path);
app.use(Express.static(staticPath));

// start http server listening for connections
server
  .once("error", error => {
    console.log(`Server error. ${error.message}`);
  })
  .listen(Config.http.port, undefined, () => {
    console.log(`Server listening on port ${Config.http.port}`);
  });

