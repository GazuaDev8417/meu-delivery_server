import { app } from "./app"
import OrderBusiness from "./business/OrderBusiness"
import OrderController from "./controller/OrderController"
import OrderData from "./data/OrderData"

import RestaurantController from "./controller/RestaurantController"
import RestaurantBusiness from "./business/RestaurantBusiness"
import RestaurantData from "./data/RestaurantData"

import UserController from "./controller/UserController"
import UserBusiness from "./business/UserBusiness"
import UserData from "./data/UserData"



const restaurantController = new RestaurantController(
    new RestaurantBusiness(new RestaurantData)
)

const userController = new UserController(
    new UserBusiness(new UserData)
)

const orderController = new OrderController(
    new OrderBusiness(new OrderData)
)


app.post('/signup', userController.signup)
app.post('/login', userController.login)

app.get('/profile', userController.getProfile)
app.get('/profile/:id', userController.getProfileByuser)
//app.get('/address/', userController.addressByUser)

app.patch('/user', userController.updateUser)
app.patch('/user-address', userController.registAddress)

app.delete('/user', userController.deleteUser)
//RESTAURANT FIELD
app.post('/signup_restaurant', restaurantController.singupRestaurant)
app.post('/login_restaurant', restaurantController.loginRestaurant)
app.post('/products', restaurantController.insertProduct)

app.get('/restaurant_products', restaurantController.productsByRestaurant)
app.get('/restaurant', restaurantController.getRestaurants)

app.delete('/product/:id', restaurantController.deleteProduct)
//ORDERS
app.post('/order', orderController.todo_orders)
app.post('/payment_preferences', orderController.orderPyament)
app.post('/pay', orderController.pay)

app.get('/payment-status/:id', orderController.paymentStatus)
app.get('/order/:id', orderController.orderById)
app.get('/active_orders', orderController.activeOrders)
app.get('/restaurant/orders', orderController.allOrders)
app.get('/user/active_orders/:id', orderController.activeOrdersByUser)
app.get('/finished_orders', orderController.finishedOrders)

app.patch('/order/:id', orderController.updateOrder)
app.patch('/finish_orders', orderController.endOrders)
app.patch('/finish_order/:id', orderController.endOrder)

app.delete('/order/:id', orderController.deleteOrder)
app.delete('/orders', orderController.cleanOrdersHistory)
app.delete('/requested_orders/:id', orderController.cleanRequestedOrders)