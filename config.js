
module.exports = {
  http: {
    port: 8888,
    path: "./public"
  },


  totpSecretUTF8:   "secretpassphrase",

  totp: {
    issuer: "Get Web Scripts",
    label: "Test",
    algorithm: "SHA1",
    digits: 6,
    period: 30
  }
};
