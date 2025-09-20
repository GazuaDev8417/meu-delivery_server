import ConnectToDatabase from "./Connexion"
import Restaurant from "../model/Restaurant"
import Product from "../model/Products"
import { ProductModel, RestaurantModel, UserModel } from "../model/typesAndInterfaces"



export default class RestaurantData extends ConnectToDatabase{
    protected RESTAURANT_TABLE = 'restaurants'
    protected PRODUCT_TABLE = 'products'
    protected USERS_TABLE = 'users'


    signupRestaurant = async(restaurant:Restaurant):Promise<void>=>{
        try{

            await restaurant.save()

        }catch(e:any){
            throw new Error(`Erro ao registrar restaurante: ${e}`)
        }
    }


    getRestaurants = async():Promise<RestaurantModel[]>=>{
        try{

            const restaurants = await ConnectToDatabase.con(this.RESTAURANT_TABLE).select(
                'address', 'phone', 'category', 'description', 'id', 'name', 'cnpj', 'logourl', 'email'
            )

            return restaurants
        }catch(e:any){
            throw new Error(`Error ao buscar restaurantes: ${e}`)
        }
    }


    restaurantById = async(id:string):Promise<RestaurantModel>=>{
        try{

            const [restaurant] = await ConnectToDatabase.con(this.RESTAURANT_TABLE)
            .select('address', 'category', 'description', 'id', 'name', 'cnpj', 'logourl', 'email')
            .where({ id })

            return restaurant
        }catch(e:any){
            throw new Error(`Erro buscar restaurante: ${e}`)
        }
    }


    restaurantByEmail = async(email:string):Promise<UserModel>=>{
        try{

            const [restaurant] = await ConnectToDatabase.con(this.USERS_TABLE).where({ email })

            return restaurant
        }catch(e:any){
            throw new Error(`Erro buscar restaurante: ${e}`)
        }
    }

//PRODUCTS
    insertProduct = async(product:Product):Promise<void>=>{
        try{

            await product.save()

        }catch(e:any){
            throw new Error(`Erro ao inserir produto: ${e}`)
        }
    }


    findProductByName = async(name:string):Promise<ProductModel>=>{
        try{

            const [product] = await ConnectToDatabase.con(this.PRODUCT_TABLE).where({ name })

            return product
        }catch(e:any){
            throw new Error(`Erro ao buscar produto: ${e}`)
        }
    }


    productsByRestaurant = async():Promise<ProductModel[]>=>{
        try{

            const products = await ConnectToDatabase.con(this.PRODUCT_TABLE)
            
            return products
        }catch(e:any){
            throw new Error(`Erro ao buscar cardápio: ${e}`)
        }
    }


    deleteProduct = async(id:string):Promise<string>=>{
        try{

            const product:ProductModel = await ConnectToDatabase.con(this.PRODUCT_TABLE)
            .where({ id })
            .first()

            if(!product){
                throw new Error('Produto não encontrado')
            }

            await ConnectToDatabase.con(this.PRODUCT_TABLE).where({ id }).del()

            return product.name
        }catch(e:any){
            throw new Error(`Erro ao excluir produto: ${e}`)
        }
    }
}