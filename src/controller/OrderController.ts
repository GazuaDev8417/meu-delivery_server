import { Request, Response } from "express"
import OrderBusiness from "../business/OrderBusiness"





export default class OrderController{
    constructor(
        private orderBusiness:OrderBusiness
    ){}

    todo_orders = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            await this.orderBusiness.todo_orders(req)

            res.status(200).send(`${req.body.product} adicionado aos pedidos. Gostaria de verificar?`)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    orderById = async(req:Request, res:Response):Promise<void>=>{
        try{

            const order = await this.orderBusiness.orderById(req)           

            res.status(200).send(order)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    deleteOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            const orders = await this.orderBusiness.deleteOrder(req)
            
            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    cleanRequestedOrders = async(req:Request, res:Response):Promise<void>=>{
        try{
            await this.orderBusiness.cleanRequestedOrders(req)
            
            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    cleanOrdersHistory = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.orderBusiness.cleanOrdersHistory(req)
            
            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    updateOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.orderBusiness.updateOrder(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    endOrders = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            await this.orderBusiness.endOrders(req)
            
            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    endOrder = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            await this.orderBusiness.endOrder(req)
            
            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    activeOrders = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            const orders = await this.orderBusiness.activeOrders(req)
            
            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    allOrders = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            const orders = await this.orderBusiness.allOrders(req)
            
            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    activeOrdersByUser = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            const orders = await this.orderBusiness.activeOrdersByUser(req)
            
            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    finishedOrders = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            const orders = await this.orderBusiness.finishedOrders(req)
            
            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    
    orderPyament = async(req:Request, res:Response):Promise<void>=>{
        try{
            const response = await this.orderBusiness.orderPayment(req)

            res.status(200).json({ init_point: response })
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    pay = async(req:Request, res:Response):Promise<void>=>{
        try{
            const response = await this.orderBusiness.pay(req)
            res.status(200).json({
                orderId: response.data.external_reference,
                status: response.data.status,
                id: response.data.id,
                payment_type: response.data.payment_type_id,
                qr_code: response.data.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
                qr_code_link: response.data.point_of_interaction?.transaction_data?.ticket_url
                            || response.data.point_of_interaction?.transaction_data?.qr_code_link
            })
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    paymentStatus = async(req:Request, res:Response):Promise<void>=>{
        try{
            const response = await this.orderBusiness.paymentStatus(req)

            res.status(200).json({ status: response })
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }
}