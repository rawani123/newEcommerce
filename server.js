import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from 'morgan'
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"

dotenv.config();

connectDB();

const app = express();


app.use(express.json())
app.use(morgan('dev'))


app.use("/api/v1/auth",authRoutes)

app.get('/',(req,res)=> {
    res.send('<h1>Welcome to e-commerce website</h1>')
})

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`.bgCyan.white)
})