import ConnectToDatabase from "../data/Connexion"



export default class Product extends ConnectToDatabase{
    protected PRODUCT_TABLE = 'products'

    constructor(
        private category:string,
        private description:string,
        private id:string,
        private name:string,
        private price:number
    ){ super() }

    save = async()=>{
        try{
            await ConnectToDatabase.con(this.PRODUCT_TABLE).insert({
                category: this.category,
                description: this.description,
                id: this.id,
                name: this.name,
                price: this.price
            })
        }catch(e){
            throw new Error(`Erro ao registrar produto: ${e}`)
        }
    }
}