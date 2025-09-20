import ConnectToDatabase from "../data/Connexion"



export default class Orders extends ConnectToDatabase{
    protected ORDERS_TABLE = 'orders'

    constructor(
        private id:string,
        private product:string,
        private price:number,
        private photoUrl:string,
        private quantity:number,
        private total:number,
        private moment:string,
        private client:string,
        private state:string,
        private address:string,
        private description:string
    ){ super() }

    save = async()=>{
        try{
            await ConnectToDatabase.con(this.ORDERS_TABLE).insert({
                id: this.id,
                product: this.product ,
                price: this.price,
                photoUrl: this.photoUrl,
                quantity: this.quantity,
                total: this.total,
                moment: this.moment,
                client: this.client,
                state: this.state,
                address: this.address,
                description: this.description
            })
        }catch(e){
            throw new Error(`Falha ao realizar pedido: ${e}`)
        }
    }
}