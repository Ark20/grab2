const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization') //checks for auth field on req
    if(!authHeader){ //if none 
        req.isAuth = false //we aren't authenticated
        return next()
    }
    const token = authHeader.split(' ')[1] //Authorization: Bearer tokenValue
    if(!token || token === '') {
        req.isAuth = false;
        next()
    }
 let decodedToken
 try{
    //only tokens with matching key are valid 
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