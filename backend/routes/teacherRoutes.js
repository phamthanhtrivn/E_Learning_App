import express from 'express'
import { add, del, findAll, findById, update } from '../controllers/teacherControllers.js'

const teacherRoute = express.Router()

teacherRoute.post('/', add)
teacherRoute.get('/:id', findById)
teacherRoute.get('/', findAll)
teacherRoute.put('/:id', update)
teacherRoute.delete('/:id', del)

export default teacherRoute