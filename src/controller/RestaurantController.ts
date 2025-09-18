import { Request, Response } from "express"
import RestaurantBusiness from "../business/RestaurantBusiness"


export default class RestaurantController{
    constructor(
        private restaurantBusiness:RestaurantBusiness
    ){}

    singupRestaurant = async(req:Request, res:Response):Promise<void>=>{
        try{

            const token = await this.restaurantBusiness.signupRestaurant(req)

            res.status(201).send(token)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    loginRestaurant = async(req:Request, res:Response):Promise<void>=>{
        try{

            const token = await this.restaurantBusiness.loginRestaurant(req)

            res.status(200).send(token)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    getRestaurants = async(req:Request, res:Response):Promise<void>=>{
        try{

            const restaurants = await this.restaurantBusiness.getRestaurants(req)

            res.status(200).send(restaurants)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

//PRODUCTS
    insertProduct = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.restaurantBusiness.insertProduct(req)

            res.status(201).send('Produto registrado com sucesso!')
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    productsByRestaurant = async(req:Request, res:Response):Promise<void>=>{
        try{

            const products = await this.restaurantBusiness.productsByRestaurant(req)

            res.status(200).send(products)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    deleteProduct = async(req:Request, res:Response):Promise<void>=>{
        try{

            const product = await this.restaurantBusiness.deleteProduct(req)

            res.status(201).send(`${product} deletado com sucesso`)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } 

}