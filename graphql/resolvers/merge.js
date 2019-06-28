const Event= require('../../models/event')
const User = require('../../models/user')
const {dateToString} = require('../../helpers/date')


const transformEvent = event => {
    console.log(event._doc.creator)

    return{
        ...event._doc,
        _id: event.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    }
}

const transformBooking = booking => {

    return{
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this,booking._doc.user), 
        event: singleEvent.bind(this,booking._doc.user), 
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),

    }
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {...user._doc, _id: user.id, createdEvents: events.bin}//created events showing up null
        })
        .catch(err => {
            throw err
        })
}
const singleEvent = async eventId => {

    try {
        const event = await Event.findById(eventId)
        return transformEvent(event)
        
    } catch (error) {
        throw(error)
    }
}

const events = eventIds => {
    return Event.find({_id : {$in: eventIds}})//find all ids that are in list 
    .then(events => {
        return events.map(event =>{
            return transformEvent(event)

        })
    })
}

exports.transformBooking = transformBooking
exports.transformEvent = transformEvent