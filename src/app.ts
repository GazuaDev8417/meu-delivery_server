import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import paymentRoutes from './routes/paymentRoutes'


config()
 


const PORT = process.env.PORT || 3003
export const app = express()

app.use(express.json())
app.use('/payments', paymentRoutes)

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []


app.use(cors({
    origin: (origin, callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Não permitido pela política de cors'))
        }
    },
    credentials: true
}))



app.listen(PORT, ()=>{ 
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})