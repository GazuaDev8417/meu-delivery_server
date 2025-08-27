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


    /* ordersByClient = async(req:Request, res:Response):Promise<void>=>{
        try{

            const orders = await this.orderBusiness.ordersByClient(req)        

            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */


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

    ordersByRestaurant = async(req:Request, res:Response):Promise<void>=>{
        try{

            const orders = await this.orderBusiness.ordersByRestaurant(req)           

            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    restaurantOrdersByClient = async(req:Request, res:Response):Promise<void>=>{
        try{

            const orders = await this.orderBusiness.restaurantOrdersByClient(req)           

            res.status(200).send(orders)
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

    /* changeOrder = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            await this.orderBusiness.changeOrder(req)
            
            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */


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


    activeRestaurantOrders = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            const orders = await this.orderBusiness.activeRestaurantOrders(req)
            
            res.status(200).send(orders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    registAddressOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.orderBusiness.registAddressOrder(req)

            res.status(201).send('Endereço registrado com sucesso')
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }
}