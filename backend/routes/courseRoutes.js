import express from 'express'
import { add, del, findAll, findById, getInspirationalCourses, getPopularCourses, getRecommendedCourses, update } from '../controllers/courseControllers.js'

const courseRoute = express.Router()

courseRoute.post('/', add)
courseRoute.get('/:id', findById)
courseRoute.get('/', findAll)
courseRoute.put('/:id', update)
courseRoute.delete('/:id', del)
courseRoute.get('/popular/:userId', getPopularCourses)
courseRoute.get('/recommended/:userId', getRecommendedCourses)
courseRoute.get('/inspirational/:userId', getInspirationalCourses)

export default courseRoute