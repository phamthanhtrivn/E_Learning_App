import express from 'express'
import { add, del, findAll, findById, update, findByUserId } from '../controllers/enrollmentControllers.js'

const enrollmentRoute = express.Router()

enrollmentRoute.post('/', add)
enrollmentRoute.get('/:id', findById)
enrollmentRoute.get('/', findAll)
enrollmentRoute.put('/:id', update)
enrollmentRoute.delete('/:id', del)
enrollmentRoute.get('/user/:userId', findByUserId);
export default enrollmentRoute