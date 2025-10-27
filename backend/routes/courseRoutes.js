import express from 'express'
import { add, del, findAll, findById, update } from '../controllers/courseControllers.js'

const courseRoute = express.Router()

courseRoute.post('/', add)
courseRoute.get('/:id', findById)
courseRoute.get('/', findAll)
courseRoute.put('/:id', update)
courseRoute.delete('/:id', del)

export default courseRoute