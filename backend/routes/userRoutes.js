import express from 'express'
import authUser from '../middlewares/authUser.js'
import { add, del, findAll, findById, login, register, update, verifyToken } from '../controllers/userControllers.js'

const userRoute = express.Router()

userRoute.post('/register', register)
userRoute.post('/login', login)
userRoute.post('/verifyToken', authUser,verifyToken)
userRoute.post('/', add)
userRoute.get('/:id', findById)
userRoute.put('/:id', update)
userRoute.delete('/:id', del)
userRoute.get('/', findAll)

export default userRoute