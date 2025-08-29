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
app.get('/address/', userController.addressByUser)

app.patch('/user', userController.updateUser)
app.patch('/user-address', userController.registAddress)

app.delete('/user', userController.deleteUser)
//RESTAURANT FIELD
app.post('/signup_restaurant', restaurantController.singupRestaurant)
app.post('/login_restaurant', restaurantController.loginRestaurant)
app.post('/products', restaurantController.insertProduct)

app.get('/restaurant_products', restaurantController.productsByRestaurant)
app.get('/restaurant', restaurantController.getRestaurants)
//app.get('/restaurants/:id', restaurantController.restaurantById)
//app.get('/restaurant', restaurantController.restaurantByToken)
//app.get('/restaurant_menu', restaurantController.restaurantMenu)
//app.get('/restaurant_orders', orderController.ordersByRestaurant)
//app.get('/active_restaurant_orders', orderController.activeRestaurantOrders)
//app.get('/users_orders/:id', orderController.restaurantOrdersByClient)

app.delete('/product/:id', restaurantController.deleteProduct)
//ORDERS
app.post('/order', orderController.todo_orders)
app.post('/payment_preferences', orderController.orderPyament)
app.post('/pay', orderController.pay)

//app.get('/orders', orderController.ordersByClient)
app.get('/order/:id', orderController.orderById)
app.get('/active_orders', orderController.activeOrders)
app.get('/finished_orders', orderController.finishedOrders)

app.patch('/order/:id', orderController.updateOrder)
app.patch('/finish_orders', orderController.endOrders)
app.patch('/finish_order/:id', orderController.endOrder)
//app.patch('/change_order/:id', orderController.changeOrder)
//app.patch('/address', orderController.registAddressOrder)

app.delete('/order/:id', orderController.deleteOrder)
app.delete('/orders', orderController.cleanOrdersHistory)
app.delete('/requested_orders/:id', orderController.cleanRequestedOrders)