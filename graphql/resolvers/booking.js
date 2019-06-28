const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')
const {dateToString} = require('../../helpers/date')
const {transformBooking, transformEvent} = require('./merge')




module.exports = { 
    
    
    //points at object with all resolver funcs  
    //resolvers should have same names as queries ,
    // function called when request looks for events 
 
    bookings: async () => { //returns all bookings 
        try{
           const bookings = await Booking.find()

           return bookings.map(booking => {
               let dog = transformBooking(booking)
               console.log(dog)

               return transformBooking(booking)
           })
        }catch (err){
            throw err
        }

    },

bookEvent: async args => {
    const fetchedEvent = await Event.findOne({_id: args.eventId}) 
    const booking = new Booking({
        user: "5d02818ed3e4fbcf71318d30",
        event: fetchedEvent
    })
    const result = await booking.save()
    return transformBooking(result)
    }
,
cancelBooking: async args => {//function to cancel bookings
    try {
        //store value of booking with given ID 
        //get booked event 
        //populate event field with rich event data 
        const booking = await Booking.findById(args.bookingId).populate('event')
        //grab event property we populated above and 
        const event = transformEvent(booking.event)
        await Booking.deleteOne({_id: args.bookingId})//delete book with specified id
        console.log(event)
        return event; 
    } catch (error) {
        throw error
    }

}
}