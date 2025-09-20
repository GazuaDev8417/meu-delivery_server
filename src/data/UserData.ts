import ConnectToDatabase from "./Connexion"
import User from "../model/User"
import { UserModel } from "../model/typesAndInterfaces"



export default class UserData extends ConnectToDatabase{
    protected USER_TABLE = 'users'
    protected ORDER_TABLE = 'orders'
//USER FIELD 
    create = async(user:User):Promise<void>=>{
        try{

            await user.save()

        }catch(e:any){
            throw new Error(`Erro ao criar usuário: ${e}`)
        }
    }


    getAllUsers = async():Promise<UserModel[]>=>{
        try{

            const users = await ConnectToDatabase.con(this.USER_TABLE)

            return users
        }catch(e:any){
            throw new Error(`Erro ao buscar usuários: ${e}`)
        }
    }

    
    findById = async(id:string):Promise<UserModel>=>{
        try{

            const [user] = await ConnectToDatabase.con(this.USER_TABLE).where({ id })

            return user
        }catch(e:any){
            throw new Error(`Erro ao buscar usuário: ${e}`)
        }
    }


    getProfile = async(id:string):Promise<UserModel>=>{
        try{

            const [user] = await ConnectToDatabase.con(this.USER_TABLE)
            .select(
                'id', 'username', 'email', 'role', 'street', 'cep', 'number', 
                'neighbourhood','city', 'state', 'complement', 'phone'
            )
            .where({ id })
            
            return user
        }catch(e:any){
            throw new Error(`Erro ao buscar usuário: ${e}`)
        }
    }

    
    findByEmail = async(email:string):Promise<UserModel>=>{
        try{

            const [user] = await ConnectToDatabase.con(this.USER_TABLE)
            .select('password', 'id', 'role')
            .where({ email })
            
            return user
        }catch(e:any){
            throw new Error(`Erro ao buscar usuário: ${e}`)
        }
    }
    
    
    registAddress = async(
        street:string,
        cep:string,
        number:string,
        neighbourhood:string,
        city:string,
        state:string,
        complement:string,
        id:string
    ):Promise<void>=>{
        try{
            
            await ConnectToDatabase.con(this.USER_TABLE).update({
                street,
                cep,
                number,
                neighbourhood,
                city,
                state,
                complement
            }).where({ id })
            
        }catch(e:any){
            throw new Error(`Erro ao atualizar usuário: ${e}`)
        }
    }


    updateUser = async(username:string, email:string, phone:string, id:string):Promise<void>=>{
        try{

            await ConnectToDatabase.con(this.USER_TABLE).update({
                username, email, phone
            }).where({ id })
            
        }catch(e:any){
            throw new Error(`Erro ao atualizar usuário: ${e}`)
        }
    }


    /* addressByUser = async(id:string):Promise<User>=>{
        try{

            const [address] = await ConnectToDatabase.con(this.USER_TABLE).select(
                'street', 'cep', 'number', 'neighbourhood', 'city', 'state', 'complement'
            ).where({ id })
            
            return address

        }catch(e:any){
            throw new Error(`Erro ao atualizar endereço: ${e}`)
        }
    } */


    deleteUser = async(id:string):Promise<void>=>{
        try{

            await ConnectToDatabase.con(this.USER_TABLE).del().where({ id })
            await ConnectToDatabase.con(this.ORDER_TABLE).del().where({ client: id })

        }catch(e:any){
            throw new Error(`Erro ao excluir usuário: ${e}`)
        }
    }

}