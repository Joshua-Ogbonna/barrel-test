import { Router } from "express";
import { createOrder, getOrder, getOrders, editOrder, deleteOrder } from "../handlers";

const router = Router()

router.get("/orders", getOrders)
router.post("/orders", createOrder)
router.get("/orders/:id", getOrder)
router.put("/order/:id", editOrder)
router.delete("/order/:id", deleteOrder)

export default router