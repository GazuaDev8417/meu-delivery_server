import { Request } from "express"
import RestaurantData from "../data/RestaurantData"
import Restaurant from "../model/Restaurant"
import Product from "../model/Products"
import Services from "../services/Authentication"
import { ProductModel, RestaurantModel } from "../model/typesAndInterfaces"




export default class RestaurantBusiness{
    constructor(
        private restaurantData:RestaurantData
    ){}
    
    signupRestaurant = async(req:Request):Promise<string>=>{
        const { name, address , phone, description, logourl, cnpj, password } = req.body

        if(!cnpj){
            throw{
                statusCode: 401,
                error: new Error('CNPJ necessário para o cadastro')
            }
        }

        /* const cnpjAPI = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
        const searchByCnpj = await fetch(cnpjAPI)
        const data = await searchByCnpj.json()
        
        if(data.message && data.message === 'CNPJ inválido'){
            throw{
                statusCode: 401,
                error: new Error(data.message)
            }
        } */
        
        const id = new Services().idGenerator()
        const token = new Services().token(id)
        const restaurant = new Restaurant(
            address, 
            /* data.atividade_principal[0].text */'Bebidas', 
            phone,
            description, 
            id, 
            logourl, 
            /* data.fantasia === '' ? */ name /* : data.fantasia */,
            cnpj,
            password
        )
          
                
        /* if(data.situacao !== 'ATIVA'){
            throw{
                statusCode: 403,
                error: new Error('A empresa já não está mais ativa')
            }
        } */

        const registeredRestaurant = await this.restaurantData.restaurantByCnpj(cnpj)
        if(registeredRestaurant){
            throw{
                statusCode: 403,
                error: new Error(`${registeredRestaurant.name} já está cadastrado(a)`)
            }
        }

        await this.restaurantData.signupRestaurant(restaurant)

        return token
    }


    loginRestaurant = async(req:Request):Promise<string>=>{
        const { cnpj, password } = req.body
        const isUserValidation:boolean = req.body.isUserValidation
        
        if(!cnpj || !password){
            throw{
                statusCode: 401,
                error: new Error('Insira as credenciais para logar(CNPJ e senha)')
            }
        }

        
        const registeredRestaurant = await this.restaurantData.restaurantByCnpj(cnpj)
        if(!registeredRestaurant){
            throw{
                statusCode: 404,
                error: new Error('Registro não encontrado')
            }
        }

        const compare = new Services().compare(password, registeredRestaurant.password)
        if(!compare){
            throw{
                statusCode: 404,
                error: new Error('Registro não encontrado')
            }
        }

        const token = new Services().token(registeredRestaurant.id)

        
        return isUserValidation ? registeredRestaurant.id : token
    }


    getRestaurants = async(req:Request):Promise<RestaurantModel>=>{
        //await new Services().authToken(req)

        const [restaurants] = await this.restaurantData.getRestaurants()
        
        if(!restaurants){
            throw{
                statusCode: 404,
                error: new Error('Restaurante não encontrado')
            }
        }

        return restaurants
    }


    restaurantById = async(req:Request):Promise<RestaurantModel>=>{
        const restaurant = await this.restaurantData.restaurantById(req.params.id)
        if(!restaurant){
            throw{
                statusCode: 404,
                error: new Error('Restaurante não encontrado')
            }
        }

        return restaurant
    }


    restaurantByToken = async(req:Request):Promise<RestaurantModel>=>{
        const restaurant = await new Services().authToken_restaurant(req)

        return restaurant
    }

//PRODUCTS 
    insertProduct = async(req:Request):Promise<void>=>{
         //const restaurant = await new Services().authToken_restaurant(req)
        const { category, description, name, photoUrl, price } = req.body
        const id = new Services().idGenerator()
        const product = new Product(
            category, description, id, name, photoUrl, price
        )

        const registeredProduct = await this.restaurantData.findProductByImage(photoUrl)
        if(registeredProduct){
            throw{
                statusCode: 403,
                error: new Error(`${registeredProduct.name} já está registrado!`)
            }
        }

        await this.restaurantData.insertProduct(product)
    }


    productsByRestaurant = async():Promise<ProductModel[]>=>{
        const products = await this.restaurantData.productsByProvider()
        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Cardápio não encontrado')
            }
        }

        return products
    }


    /* restaurantMenu = async(req:Request):Promise<ProductModel[]>=>{
        const restaurant = await new Services().authToken_restaurant(req)

        const products = await this.restaurantData.productsByProvider()
        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Cardápio não encontrado')
            }
        }

        return products
    } */


    deleteProduct = async(req:Request):Promise<string>=>{
        await new Services().authToken_restaurant(req)

        const product = await this.restaurantData.deleteProduct(req.params.id)

        return product
    }
}


