const { expressjwt } = require("express-jwt");
const tokenController = require("../../controller/token_controller.js")
const authJWT = ()=>{
    const secret = process.env.SECRET_KEY
    const api = process.env.API_URL
    return expressjwt({
        secret: secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            `${api}/user/register`,
            `${api}/user/login`,
            `${api}/user/changepassword`,
            {url: /\/api\/v1\/topic(.*)/},
            `${api}/upload/image`,
            {url: /\/public\/uploads(.*)/},
            `${api}/service/sendEmail`,
            `${api}/token/deleteall`
        ]
    })
}

isRevoked = async (req,token)=>{
    const tokenString = getTokenFromJWT(token)
    const isRevokedToken = await tokenController.checkTokenIsRevoked(tokenString)
    return isRevokedToken
}


function getTokenFromJWT(jwtObject) {
    const serializedHeader = JSON.stringify(jwtObject.header);
    const serializedPayload = JSON.stringify(jwtObject.payload);
    var token = `${base64urlEncode(serializedHeader)}.${base64urlEncode(serializedPayload)}`;
  
    // Append the signature if it exists
    if (jwtObject.signature) {
      token += `.${jwtObject.signature}`;
    }
  
    return token;
}
function base64urlEncode(str) {
    return Buffer.from(str).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    }

module.exports = authJWT