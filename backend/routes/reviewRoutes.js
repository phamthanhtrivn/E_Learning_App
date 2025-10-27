import express from 'express'
import { add, del, findAll, findById, update } from '../controllers/reviewControllers.js'

const reviewRoute = express.Router()

reviewRoute.post('/', add)
reviewRoute.get('/:id', findById)
reviewRoute.get('/', findAll)
reviewRoute.put('/:id', update)
reviewRoute.delete('/:id', del)

export default reviewRoute