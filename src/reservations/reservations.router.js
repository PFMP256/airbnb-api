const router = require('express').Router()
const reservationServices = require('./reservations.http')

router.route('/')
    .get(reservationServices.getAll)


module.exports = {
    router
}