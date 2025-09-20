import ConnectToDatabase from "./Connexion"
import Orders from "../model/Order"
import { OrderModel } from "../model/typesAndInterfaces"



export default class OrderData extends ConnectToDatabase{
    protected ORDER_TABLE = 'orders'

    
    todo_orders = async(order:Orders):Promise<void>=>{
        try{

            await order.save()

        }catch(e:any){
            throw new Error(`Erro ao realizar pedido: ${e}`)
        }
    }


    findOrderByRequest = async(product:string, client:string):Promise<OrderModel>=>{
        try{

            const [order] = await ConnectToDatabase.con(this.ORDER_TABLE).where({
                product, client, state: 'REQUESTED'
            })
            
            return order
        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }


    orderById = async(id:string):Promise<OrderModel>=>{
        try{
            
            const [order] = await ConnectToDatabase.con(this.ORDER_TABLE).where({ id })
            
            return order
        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }

    
    allOrders = async()=>{
        try{
            
            const orders = await ConnectToDatabase.con(this.ORDER_TABLE)

            if(orders.length === 0){
                throw new Error('Nenhum pedido realizado')
            }
            
            return orders
        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }

    activeOrders = async(client:string):Promise<OrderModel[]>=>{
        try{
            
            const activeOrders = await ConnectToDatabase.con(this.ORDER_TABLE)
                .where({ client, state: 'REQUESTED' })

            if(activeOrders.length === 0){
                throw new Error('Você ainda não fez nenhum pedido')
            }
            
            return activeOrders
        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }

    activeOrdersByUser = async(client:string):Promise<OrderModel[]>=>{
        try{
            
            const activeOrders = await ConnectToDatabase.con(this.ORDER_TABLE)
                .where({ client })

            if(activeOrders.length === 0){
                throw new Error('Você ainda não fez nenhum pedido')
            }
            
            return activeOrders
        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }

    finishedOrders = async(client:string):Promise<OrderModel[]>=>{
        try{
            
            const activeOrders = await ConnectToDatabase.con(this.ORDER_TABLE)
                .where({ client, state: 'FINISHED' })

            if(activeOrders.length === 0){
                throw new Error('Você ainda não fez nenhum pedido')
            }
            
            return activeOrders
        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }
        
    
    deleteOrder = async(id:string):Promise<void>=>{
        try{
            
            await ConnectToDatabase.con(this.ORDER_TABLE).delete().where({ id })

        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }

    }


    updateOrder = async(quantity:number, id:string):Promise<void>=>{
        try{
            
            const [order] = await ConnectToDatabase.con(this.ORDER_TABLE).where({ id })
            
            await ConnectToDatabase.con(this.ORDER_TABLE).update({
              quantity,
              total: quantity * order.price
            }).where({ id })

        }catch(e:any){
            throw new Error(`Erro ao buscar pedido: ${e}`)
        }
    }


    endDorders = async(id:string, paymentMethod:string):Promise<void>=>{
        try{

            const orders:OrderModel[] = await ConnectToDatabase.con(this.ORDER_TABLE)
                .where({
                    client: id,
                    state: 'REQUESTED'
                })
            
            if(orders.length === 0){
                throw new Error('Todos os pedidos já foram finalizados')
            }

            await ConnectToDatabase.con(this.ORDER_TABLE).update({
                state: 'FINISHED',
                paymentmethod: paymentMethod
            }).where({ client: id })

        }catch(e:any){
            throw new Error(`Erro ao finalizar pedidos: ${e}`)
        }
    }

    endOrder = async(id:string, paymentMethod:string):Promise<void>=>{
        try{

            const [order]:OrderModel[] = await ConnectToDatabase.con(this.ORDER_TABLE)
                .where({ id })
            
            if(!order){
                throw new Error('Pedido não encontrado')
            }

            await ConnectToDatabase.con(this.ORDER_TABLE).update({
                state: 'FINISHED',
                paymentmethod: paymentMethod
            }).where({ id })

        }catch(e:any){
            throw new Error(`Erro ao marcar pedido: ${e}`)
        }
    }


    cleanOrdersHistory = async(client:string):Promise<void>=>{
        try{

            const orders:OrderModel[] = await ConnectToDatabase.con(this.ORDER_TABLE).where({
                client, state: 'FINISHED'
            })

            if(orders.length === 0){
                throw new Error('Sua lista de histórico já está vazia!')
            }

            await ConnectToDatabase.con(this.ORDER_TABLE).delete().where({
                client,
                state: 'FINISHED'
            })


        }catch(e:any){
            throw new Error(`Erro ao limpar histórico: ${e}`)
        }
    }

    
    cleanRequestedOrders = async(client:string, provider:string):Promise<void>=>{
        try{


            const orders:OrderModel[] = await ConnectToDatabase.con(this.ORDER_TABLE).where({
                client
            })

            if(orders.length === 0){
                throw new Error('Sua lista de pedidos já está vazia!')
            }

            await ConnectToDatabase.con(this.ORDER_TABLE).delete().where({
                client,
                restaurant: provider
            })

        }catch(e:any){
            throw new Error(`Erro ao limpar histórico: ${e}`)
        }
    }
   
}