import ConnectToDatabase from "../data/Connexion"



export default class User extends ConnectToDatabase{
    protected USER_TABLE = 'users'

    constructor(
        private id:string,
        private username:string,
        private email:string,
        private phone:string,
        private password:string
    ){ super() }

    save = async()=>{
        try{
            await ConnectToDatabase.con(this.USER_TABLE).insert({
                id: this.id.trim(),
                username: this.username.trim(),
                email: this.email.trim(),
                phone: this.phone.trim(),
                password: this.password.trim()
            })
        }catch(e){
            throw new Error(`Erro ao registrar usuário: ${e}`)
        }
    }
}