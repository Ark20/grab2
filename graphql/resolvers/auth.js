
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//resolver to create a user 
module.exports = {
createUser: (args) => { //pass in input 
    return User.findOne({email: args.userInput.email}).then(user=> { //find a user with email passed in 
        if(user) { //if the user already exists throw error 
            throw new Error('User exists already')
        }
        return bcrypt //returned the password hashed 12 times 
    .hash(args.userInput.password,12)
    }) 
    .then(hashedPassword => { //then pass hashed password into function 
        console.log()
        const user = new User({//create a new user with hashed pw
            email: args.userInput.email, 
            password: hashedPassword
        })
       return user.save() //save user 
     }) //return user with password set to null so noonce can see duh and the i.d 
     .then(result => { //result is data returned from save promise 
        return {...result._doc, password: null, _id: result.id } //sets pw to null
     })
     .catch(err => {
        throw err;
    })



},
login: async ({email,password}) => {
    const user = await User.findOne({email: email})
    if(!user){
        throw new Error('no usr');
    }
    const isEqual = await bcrypt.compare(password,user.password)
    if (!isEqual){
        throw new Error('no usr');

    }
    const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkeytohashandvalidate', {
        expiresIn: '1h',
    })
    return {userId: user.id, token: token, tokenExpiration: 1}
}
}