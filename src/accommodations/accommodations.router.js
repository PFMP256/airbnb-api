const router = require('express').Router()
const passport = require('passport')

const accommodationServices = require('./accommodations.http')
const reservationServices = require('../reservations/reservations.http')
require('../middleware/auth.middleware')(passport)

router.route('/')
    .get(accommodationServices.getAll)

router.route('/:id')
    .get(accommodationServices.getById)
    .put(passport.authenticate('jwt', { session: false }), accommodationServices.edit)
    .delete(passport.authenticate('jwt', { session: false }), accommodationServices.remove)

router.route('/:id/make-reservation')
    .post(passport.authenticate('jwt', {session: false}), reservationServices.postReservation)

router.get('/me', passport.authenticate('jwt', { session: false }), accommodationServices.getAllUserLog)

module.exports= {
    router
}
