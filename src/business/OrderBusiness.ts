import { Request } from "express"
import Orders from "../model/Order"
import OrderData from "../data/OrderData"
import Services from "../services/Authentication"
import moment from "moment-timezone"
import { OrderModel } from "../model/typesAndInterfaces"
import axios from "axios"
import { config } from "dotenv"
import { v4 } from "uuid"


config()




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
    

    orderById = async(req:Request):Promise<OrderModel>=>{
        const user = await new Services().authToken(req)

        if(user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuários ADM')
            }
        }

        const order = await this.orderData.orderById(req.params.id)
       
        return order
   }

   
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
        const user = await new Services().authToken(req)

        if(user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuários ADM')
            }
        }
        
        const { paymentmethod } = req.body
        
        if(!paymentmethod){
            throw{
                statusCode: 403,
                error: new Error('Selecione um método de pagamento')
            }
        }

        await this.orderData.endOrder(req.params.id, paymentmethod)
    }

    
    activeOrders = async(req:Request):Promise<OrderModel[]>=>{
        const user = await new Services().authToken(req)
        const orders = await this.orderData.activeOrders(user.id)

        await this.removeOldOrders(orders)

        return orders
    }

    allOrders = async(req:Request):Promise<OrderModel[]>=>{
        const user = await new Services().authToken(req)
        const orders = await this.orderData.allOrders()

        if(user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuários ADM')
            }
        }

        if(orders.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Lista de pedidos vazia')
            }
        } 
        
        await this.removeOldOrders(orders)

        return orders
    }


    removeOldOrders = async(orders:OrderModel[]):Promise<void>=>{
        orders.map(async order=>{
            const momentDate = order.moment.split(' ')[0]
            const momentDateSplitted = Number(momentDate.split('/')[0])
            const now = new Date().toISOString()
            const localMoment = moment.utc(now).tz("America/Sao_Paulo").format('DD/MM/YYYY')
            const localMomentSplitted = Number(localMoment.split('/')[0])
            
            if(momentDateSplitted < localMomentSplitted){
                await this.orderData.deleteOrder(order.id)
            }
        })
    }


    activeOrdersByUser = async(req:Request):Promise<OrderModel[]>=>{
        const user = await new Services().authToken(req)

        if(user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuários ADM')
            }
        }

        const orders = await this.orderData.activeOrdersByUser(req.params.id)

        return orders
    }

    finishedOrders = async(req:Request):Promise<OrderModel[]>=>{
        const user = await new Services().authToken(req)
        const orders = await this.orderData.finishedOrders(user.id)

        await this.removeOldOrders(orders)

        return orders
    }


    orderPayment = async(req:Request)=>{
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN
        const { items } = req.body

        const response = await axios.post(
                'https://api.mercadopago.com/checkout/preferences',
                { items },
                { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }}
            )

        return response.data.init_point 
    } 
    
    
    pay = async(req:Request)=>{
        try{
            const { paymentMethodId, email, token, items } = req.body
            const orderId = `${email}-${Date.now()}`
            const transaction_amount = items.reduce(
                (acc: number, item: any) => acc + (item.unit_price * item.quantity),
                0
            )

            const transaction_amount_fixed = Number(transaction_amount).toFixed(2)
            const body:any = {
                transaction_amount: Number(transaction_amount_fixed),
                description: 'Compra no app',
                payment_method_id: paymentMethodId,
                payer: { email },
                external_reference: orderId
            }


            if(['visa', 'master', 'amex'].includes(paymentMethodId)){
                body.token = token
                body.installments = 1
            }else{
                delete body.installments
            }

            const response = await axios.post(
                'https://api.mercadopago.com/v1/payments',
                body,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN_TP}`,
                        'X-Idempotency-Key': v4()
                    }
                }
            )

            return response
        }catch(e:any){
            if(axios.isAxiosError(e)){
                throw{
                    statusCode: e.response?.status || 500,
                    error: e.response?.data || e.message
                }
            }

            throw{
                statusCode: e.statusCode || 500,
                error: e.message || 'Erro interno ao processar pagamento'
            }
        }     
    }
    
    
    paymentStatus = async(req:Request):Promise<string>=>{
        const { id } = req.params

        try{
            
            const res = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN_TP}` }
            })

            const data = await res.data
            return data.status                       
        }catch(e:any){
            if(e.response){
                return e.response.status
            }else{
                throw new Error(e.message)
            }
        }
    }
}