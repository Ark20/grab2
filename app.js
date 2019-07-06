const express = require('express')
const bodyParser = require('body-parser')
//exports function that we can use as middleware to forward queries to resolvers
const graphqlHttp = require('express-graphql')
//takes template literal to define schema
//pulling properties of object 
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

//connect to mongoose
const bcrypt = require('bcryptjs')
const app  = express()

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolver = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(isAuth)

//use graphql middelware 
app.use(
    '/graphql',//endpoint for all graphql queries 
    graphqlHttp({ //middlware function where we pass js object to define schema
        //schema points at graphql schema
        schema: graphQLSchema,
        //name(arg:type):return 
        //root commands are required to adhere to standard of packeages 
        //keyword root in query object 
        //in schema definition pointing to RootQuery bundles all of queries in obj 
    rootValue: graphQLResolver, //points at object with all resolver funcs  
        //resolvers should have same names as queries ,
        // function called when request looks for events 
 graphiql: true //debugging tool url we can visit to play with api 
})
)

//use string from cluster to connect to db 

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@cluster0-y4gne.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(()=> {
    app.listen(8000)
}).catch(err=>{
    console.log("connnnnn")

    console.log(err)
})

