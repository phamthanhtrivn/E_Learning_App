import express from 'express'
import { add, del, findAll, findById, update } from '../controllers/categoryControllers.js'

const categoryRoute = express.Router()

categoryRoute.post('/', add)
categoryRoute.get('/:id', findById)
categoryRoute.get('/', findAll)
categoryRoute.put('/:id', update)
categoryRoute.delete('/:id', del)

export default categoryRoute