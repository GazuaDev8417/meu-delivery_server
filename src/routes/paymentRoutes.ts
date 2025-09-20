// src/routes/paymentRoutes.ts
import { Router, Request, Response } from "express";
import { config } from "dotenv"
import axios from "axios"

config()

const router = Router();

// armazena status em memória
const paymentStatus: Record<string, string> = {};

// Webhook que o Mercado Pago chama
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const topic = req.body.type;
    const paymentId = req.body.data?.id;

    if (topic === "payment" && paymentId) {
      const ACCESS_TOKEN = process.env.ACCESS_TOKEN_TP;
      const { data } = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
      );

      const { status, external_reference } = data;

      paymentStatus[external_reference] = status; // 👈 guarda em memória
      console.log(`Pagamento ${paymentId} -> ${status}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no webhook");
  }
});


router.get("/status/:orderId", (req: Request, res: Response) => {
  const { orderId } = req.params;
  res.json({ status: paymentStatus[orderId] || "pending" });
})

export default router;
