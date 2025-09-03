import express from 'express'
import cors from 'cors'
import paymentRoutes from './routes/paymentRoutes'
 


const PORT = process.env.PORT || 3003
export const app = express()

app.use(express.json())
app.use(cors())
app.use('/payments', paymentRoutes)



app.listen(PORT, ()=>{ 
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})