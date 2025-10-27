import express from 'express'
import { add, del, findAll, findById, update } from '../controllers/questionControllers.js'

const questionRoute = express.Router()

questionRoute.post('/', add)
questionRoute.get('/:id', findById)
questionRoute.get('/', findAll)
questionRoute.put('/:id', update)
questionRoute.delete('/:id', del)

export default questionRoute