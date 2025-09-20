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
        const { name, address , phone, email, description, logourl, cnpj, password } = req.body

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

        const registeredRestaurant = await this.restaurantData.restaurantByEmail(email)
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
        const { email, password } = req.body
        
        if(!email || !password){
            throw{
                statusCode: 401,
                error: new Error('Insira as credenciais para logar(email e senha)')
            }
        }

        
        const registeredRestaurant = await this.restaurantData.restaurantByEmail(email)
        
        if(!registeredRestaurant){
            throw{
                statusCode: 404,
                error: new Error('Registro não encontrado')
            }
        }

        if(registeredRestaurant.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuários ADM')
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

        
        return token
    }


    getRestaurants = async(req:Request):Promise<RestaurantModel>=>{
        const [restaurants] = await this.restaurantData.getRestaurants()
        
        if(!restaurants){
            throw{
                statusCode: 404,
                error: new Error('Restaurante não encontrado')
            }
        }

        return restaurants
    }

//PRODUCTS 
    insertProduct = async(req:Request):Promise<void>=>{
        const { category, description, name, price } = req.body
        const id = new Services().idGenerator()
        const product = new Product(
            category, description, id, name, price
        )

        const registeredProduct = await this.restaurantData.findProductByName(name)
        if(registeredProduct){
            throw{
                statusCode: 403,
                error: new Error(`${registeredProduct.name} já está registrado!`)
            }
        }

        await this.restaurantData.insertProduct(product)
    }


    productsByRestaurant = async(req:Request):Promise<ProductModel[]>=>{        
        const products = await this.restaurantData.productsByRestaurant()
        
        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Cardápio não encontrado')
            }
        }

        return products
    }


    deleteProduct = async(req:Request):Promise<string>=>{
        const user = await new Services().authToken(req)

        if(user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuários ADM')
            }
        }

        const product = await this.restaurantData.deleteProduct(req.params.id)

        return product
    }
}


