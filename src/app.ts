import express from 'express'
import cors from 'cors'
import paymentRoutes from './routes/paymentRoutes'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './swagger.json'
 


const PORT = process.env.PORT || 3003
export const app = express()

app.use(express.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use('/payments', paymentRoutes)



app.listen(PORT, ()=>{ 
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`)
})