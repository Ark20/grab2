const Event= require('../../models/event')
const User = require('../../models/user')

const {transformEvent} = require('./merge')



module.exports = { 
    
    
    //points at object with all resolver funcs  
    //resolvers should have same names as queries ,
    // function called when request looks for events 
    events: () => {
        return Event.find()
        .then(events => { //return all events 
            return events.map(event => { 

//_doc is property provided by mongoose
                return transformEvent(event)
            })

        }).catch(err => {
            throw err; 
        })
    },
    //args holds all arguments 
    createEvent: (args) => {

//when an event is created find the user it's linked to and add the event to the users list of events 
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5d02818ed3e4fbcf71318d30"
        });
        let createdEvent;//variable to store created event
        return event 
            .save()//save event 
            .then(result => {//onece event is saved 
                createdEvent = transformEvent(result)//store event in var 

            return User.findById('5d02818ed3e4fbcf71318d30')    
        })
        .then(user => {
            if(!user) {
                throw new Error('User dont ekzist already')
            }
            user.createdEvents.push(event)// add event to users created events 
            return user.save()
        })
        .then(result => {
            return createdEvent
        })
        .catch(err=> {
            console.log(err)
            throw err
        })
    }

}