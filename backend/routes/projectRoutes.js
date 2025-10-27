import express from 'express'
import { add, del, findAll, findById, update } from '../controllers/projectControllers.js'

const projectRoute = express.Router()

projectRoute.post('/', add)
projectRoute.get('/:id', findById)
projectRoute.get('/', findAll)
projectRoute.put('/:id', update)
projectRoute.delete('/:id', del)

export default projectRoute