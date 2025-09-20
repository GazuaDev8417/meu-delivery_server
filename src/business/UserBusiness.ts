import { Request } from "express"
import UserData from "../data/UserData"
import Services from "../services/Authentication"
import User from "../model/User"
import { UserModel } from "../model/typesAndInterfaces"



export default class UserBusiness{
    constructor(
        private userData:UserData
    ){}
//USER FIELD
    signup = async(req:Request):Promise<string>=>{
        const { name, email, phone, password, role } = req.body
        const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
        const regexPhone = /^(\d{2})9\d{8}$/;


        if(!name || !email || !phone || !password){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        if(!regexEmail.test(email)){
            throw{
                statusCode: 403,
                error: new Error('Email inválido!')
            }
        }

        if(!regexPhone.test(phone)){
            throw{
                statusCode: 403,
                error: new Error('Telefone inválido!')
            }
        }

        if(password.length < 6){
            throw{
                statusCode: 403,
                error: new Error('Sua senha deve ter o mínimo de 6 caractéres')
            }
        }

        const registeredUser = await this.userData.findByEmail(email)
        if(registeredUser){            
            throw{
                statusCode: 403,
                error: new Error('Usuário já cadastrado')
            }
        
        }

        if(password.length < 6){
            throw{
                statusCode: 403,
                error: new Error('Sua senha deve ter no mínimo 6 caracteres')
            }
        }

        const id = new Services().idGenerator()
        const hash = new Services().hash(password)
        const token = new Services().token(id)

        const user = new User(id, name, email, phone, hash, role)

        await this.userData.create(user)

        return token
    }


    getProfile = async(req:Request):Promise<UserModel>=>{
        const profile = await new Services().authToken(req)

        return profile
    }

    getProfileByUser = async(req:Request):Promise<UserModel>=>{
        const user = await new Services().authToken(req)


        if(user && user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para estabelecimentos ou usuário ADM')
            }
        }

        const profile = await this.userData.getProfile(req.params.id)

        return profile
    }


    login = async(req:Request):Promise<{ token:string, role:string}>=>{
        const { email, password } = req.body
        const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

        if(!password || !email){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        if(!regex.test(email)){
            throw{
                statusCode: 403,
                error: new Error('Email inválido!')
            }
        }

        const registeredUser = await this.userData.findByEmail(email)
        if(!registeredUser){            
            throw{
                statusCode: 404,
                error: new Error('Usuário não encontrado')
            }
        
        }

        const compare = new Services().compare(password, registeredUser.password)
        if(!compare){
            throw{
                statusCode: 404,
                error: new Error('Usuário não encontrado')
            }
        }

        const token = new Services().token(registeredUser.id)

        return { token, role: registeredUser.role }    
    }


    registAddress = async(req:Request):Promise<void>=>{
        const user = await new Services().authToken(req)
        const { street, cep, number, neighbourhood, city, state, complement } = req.body
        /* const regex = /^\d+$/ */
        
        /* let finalStreet = street
        let finalNeighbourhood = neighbourhood
        let finalCity = city
        let finalState = state */

        if(!street || !cep || !neighbourhood || !city || !state || !complement){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        /* if(!regex.test(cep)){
            throw{
                statusCode: 403,
                error: new Error('Cep inválido! Deve conter apenas números')
            }
        } *//* else{
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data:cepModel = await res.json()

            finalStreet = !street ? data.logradouro : street
            finalNeighbourhood = !neighbourhood ? data.bairro : neighbourhood
            finalCity = !city ? data.localidade : city
            finalState = !state ? data.estado : state
        } */
        
        await this.userData.registAddress(
            street, cep, number, neighbourhood, city, state, complement, user.id
        )
    }


    updateUser = async(req:Request):Promise<void>=>{
        const user = await new Services().authToken(req)
        const { username, email, phone } = req.body
        const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

        if(!username || !email ){
            throw{
                statusCode: 403,
                error: new Error('Preencha os campos')
            }
        }

        if(!regex.test(email)){
            throw{
                statusCode: 403,
                error: new Error('Email inválido!')
            }
        }

        await this.userData.updateUser(username, email, phone, user.id)
    }


    /* addressByUser = async(req:Request):Promise<User>=>{
        const user = await new Services().authToken(req)
        const address = await this.userData.addressByUser(user.id)
        const checkdAddress = Object.values(address).some(value => value !== null)

        if(!checkdAddress){
            throw{
                statusCode: 404,
                error: new Error('Usuário sem endereço cadastrado')
            }
        }
        
        return address
    } */


    deleteUser = async(req:Request):Promise<void>=>{
        const user = await new Services().authToken(req)

        await this.userData.deleteUser(user.id)
    }

}