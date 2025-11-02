import express from 'express'
import authUser from '../middlewares/authUser.js'
import { add, del, findAll, findById, login, register, toggleSavedCourse, update, verifyToken, getCart, addToCart, deleteFromCart, clearCart } from '../controllers/userControllers.js'

const userRoute = express.Router()

userRoute.post('/register', register)
userRoute.post('/login', login)
userRoute.post('/verifyToken', authUser, verifyToken)
userRoute.post('/', add)
userRoute.post('/saveCourse', toggleSavedCourse)
userRoute.get('/:id', findById)
userRoute.put('/:id', update)
userRoute.delete('/:id', del)
userRoute.get('/', findAll)
userRoute.get('/cart/:id', getCart)
userRoute.post('/cart', addToCart)
userRoute.delete('/cart/:userId/:courseId', deleteFromCart)
userRoute.get('/cart/clear/:userId', clearCart)


export default userRoute