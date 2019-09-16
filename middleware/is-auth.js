const jwt = require('jsonwebtoken')
//require package that creates and verifies JWTs 

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization') //returns value of authorization field on header 
    if(!authHeader){ //if there is no auth 
        req.isAuth = false //we aren't authenticated
        return next()
    }
    const token = authHeader.split(' ')[1] //Authorization: Bearer tokenValue
    if(!token || token === '') { //if no value return false 
        req.isAuth = false;
        next()
    }
 let decodedToken
 try{
     //token is the JWT string 
     //secret ofPublicKey - string or buffer with secret for HMAC algo
    //only tokens with matching key are valid 
    //below returns decoded payload
   decodedToken = jwt.verify(token, 'somesupersecretkeytohashandvalidate')//check if token matches key we used to create token 
 } catch(err){
     req.isAuth = false
     return next()
 }
//we haev decoded token 
if(!decodedToken){
    req.isAuth = false; 
    return next()
}
req.isAuth = true; 
req.userId = decodedToken.userId  //helps us fetch user from db 
next()
}


//validate incoming requests to block or allow access 