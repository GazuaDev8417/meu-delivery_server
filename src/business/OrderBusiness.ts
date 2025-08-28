import { Request } from "express"
import Orders from "../model/Order"
import OrderData from "../data/OrderData"
import Services from "../services/Authentication"
import moment from "moment-timezone"
import { OrderModel } from "../model/typesAndInterfaces"





export default class OrderBusiness{
    constructor(
        private orderData:OrderData
    ){}

    todo_orders = async(req:Request):Promise<void>=>{
        const user = await new Services().authToken(req)
        const address = `${user.street} ${user.number}, ${user.neighbourhood} ${user.city} - ${user.state}`
        const { product, price, quantity, momentString, photoUrl, description } = req.body
        const localMoment = moment.utc(momentString).tz("America/Sao_Paulo").format('DD/MM/YYYY [às] HH:mm')
        const id = new Services().idGenerator()
        const order = new Orders(
            id, product, price, photoUrl, quantity,
            quantity * price,
            localMoment,
            user.id,
            'REQUESTED',
            address,
            description
        )
        

        const registeredOrders = await this.orderData.findOrderByRequest(product, user.id)
        if(registeredOrders){
            throw{
                statusCode: 403,
                error: new Error(`Você já fez um pedido '${product}'. Gostaria de verificar?`)
            }
        }

        await this.orderData.todo_orders(order)
    }


    /* ordersByClient = async(req:Request):Promise<OrderModel[]>=>{
         const token = req.headers.authorization
         const userId = new Services().tokenData(token as string).payload

         const orders = await this.orderData.ordersByClient(userId)
        
         return orders
    } */


    orderById = async(req:Request):Promise<OrderModel>=>{
        await new Services().authToken_restaurant(req)

        const order = await this.orderData.orderById(req.params.id)
       
        return order
   }

    /* ordersByRestaurant = async(req:Request):Promise<OrderModel[]>=>{
        const restaurant = await new Services().authToken_restaurant(req)

        const orders = await this.orderData.ordersByRestaurant(restaurant.id)
       
        return orders
   } */

    /* restaurantOrdersByClient = async(req:Request):Promise<OrderModel[]>=>{
        const restaurant = await new Services().authToken_restaurant(req)
        
        const orders = await this.orderData.restaurantOrdersByClient(restaurant.id, req.params.id)
    
        return orders
    } */


    deleteOrder = async(req:Request):Promise<void>=>{
        await new Services().authToken(req)
        
        await this.orderData.deleteOrder(req.params.id)
    }


    cleanOrdersHistory = async(req:Request):Promise<void>=>{
        const user = await new Services().authToken(req)

        await this.orderData.cleanOrdersHistory(user.id)
    }

    cleanRequestedOrders = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const userId = new Services().tokenData(token as string).payload
        
        await this.orderData.cleanRequestedOrders(userId, req.params.id)
    }


    updateOrder = async(req:Request):Promise<void>=>{
        const { quantity } = req.body

        if(!quantity){
            throw{
                statusCode: 401,
                error: new Error('Insira uma quantidade para o produto')
            }
        }

        await this.orderData.updateOrder(quantity, req.params.id)
    }


    endOrders = async(req:Request):Promise<void>=>{
        const user = await new Services().authToken(req)
        const { paymentMethod } = req.body
        
        await this.orderData.endDorders(user.id, paymentMethod)
    }

    endOrder = async(req:Request):Promise<void>=>{
        await new Services().authToken(req)
        
        const { paymentmethod } = req.body

        await this.orderData.endOrder(req.params.id, paymentmethod)
    }

    /* changeOrder = async(req:Request):Promise<void>=>{

        await this.orderData.changeOrder(req.params.id)
    } */

    
    activeOrders = async(req:Request):Promise<OrderModel[]>=>{
        const user = await new Services().authToken(req)
        const orders = await this.orderData.activeOrders(user.id)

        return orders
    }

    finishedOrders = async(req:Request):Promise<OrderModel[]>=>{
        const user = await new Services().authToken(req)
        const orders = await this.orderData.finishedOrders(user.id)

        return orders
    }


    /* activeRestaurantOrders = async(req:Request):Promise<OrderModel[]>=>{
        const restaurant = await new Services().authToken_restaurant(req)
        const orders = await this.orderData.activeRestaurantOrders(restaurant.id)

        return orders
    } */

    /* registAddressOrder = async(req:Request):Promise<void>=>{
        const { street, cep, number, neighbourhood, city, state, complement, person } = req.body
        const address = `${street} ${number}, ${cep}, ${neighbourhood} - ${city}/${state} - ${complement}, ${person}`
        const token = req.headers.authorization
        const userId = new Services().tokenData(token as string).payload

        await this.orderData.registAddressOrder(address, userId)
    } */

    
}