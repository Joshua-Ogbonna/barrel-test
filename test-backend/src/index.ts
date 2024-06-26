import express from "express"
import { PORT } from "./utils/constants"
import orderRoute from "./routes/orders"

const app = express()

app.use(express.json())
app.use("/api", orderRoute)

app.listen(PORT, () => console.log(`Server running on ${PORT}`))