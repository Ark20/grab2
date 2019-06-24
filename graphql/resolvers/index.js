const bcrypt = require('bcryptjs')
const Event= require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {...user._doc, _id: user.id, createdEvents: events.bin}
        })
        .catch(err => {
            throw err
        })
}
const singleEvent = async eventId => {

    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,//all data in doc
            _id: event.id,//replace id with eventId
            creator: user.bind(this,event.creator)
        }
        
    } catch (error) {
        throw(error)
    }
}

const events = eventIds => {
    return Event.find({_id : {$in: eventIds}})//find all ids that are in list 
    .then(events => {
        return events.map(event =>{
            return{
                ...event._doc,
                 _id: event.id, 
                 date: new Date(event._doc.date).toISOString(),
                 creator: user.bind(this, event.creator)//calls function to access creator 
                }

        })
    })
}


module.exports = { 
    
    
    //points at object with all resolver funcs  
    //resolvers should have same names as queries ,
    // function called when request looks for events 
    events: () => {
        return Event.find()
        .then(events => { //return all events 
            return events.map(event => { 
//_doc is property provided by mongoose
                return {...event._doc, _id: event._doc._id.toString(), 
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator) }//return new object for every element in events
            })

        }).catch(err => {
            throw err; 
        })
    },
    bookings: async () => {
        try{
           const bookings = await Booking.find()
           return bookings.map(booking => {
               return {
                   ...booking._doc,//all doc data
                   _id: booking.id,
                   user: user.bind(this,booking._doc.user),
                   event: singleEvent.bind(this, booking._doc.event),
                   createdAt: new Date(booking._doc.createdAt).toISOString(),
                   updatedAt: new Date(booking._doc.createdAt).toISOString()

                }
           })
        }catch (err){
            throw err
        }

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
                createdEvent = {...result._doc, _id: result._doc._id.toString(), creator: user.bind(this, result._doc.creator)}//store event in var 
                console.log(result)

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
    },
    createUser: (args) => {
        return User.findOne({email: args.userInput.email}).then(user=> {
            if(user) {
                throw new Error('User exists already')
            }
            return bcrypt
        .hash(args.userInput.password,12)
        }) 
        .then(hashedPassword => {
            console.log()
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
           return user.save()
         })
         .then(result => {
            return {...result._doc, password: null, _id: result.id } //sets pw to null
         })
         .catch(err => {
            throw err;
        })
    

    
},
bookEvent: async args => {
    const fetchedEvent = await Event.findOne({_id: args.eventId}) 
    const booking = new Booking({
        user: "5d02818ed3e4fbcf71318d30",
        event: fetchedEvent
    })
    const result = await booking.save()
    return {
            ...result._doc,
             _id: result.id,
             user: user.bind(this,booking._doc.user),
             event: singleEvent.bind(this, booking._doc.event),
             createdAt: new Date(booking._doc.createdAt).toISOString(),
             updatedAt: new Date(booking._doc.createdAt).toISOString()
            }
    }
,
cancelBooking: async args => {
    try {
        const booking = await Booking.findById(args.bookingId).populate('event')
        const event = {...booking.event,
                        _id: booking.event.id,
                        creator: user.bind(this, booking.creator)
                    } 
        await Booking.deleteOne({_id: args.bookingId})

    } catch (error) {
        throw error
    }

}
}