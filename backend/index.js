import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js";
import dotenv from 'dotenv'
import cors from "cors"
import orderRouter from "./routers/orderRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
dotenv.config();


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
    (req, res, next)=>{

        const value = req.header("Authorization")

        if(value != null){
            const token = value.replace("Bearer ","")
            jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{ 
                if(decoded == null){
                    res.status(403).json(
                        {
                            message : "Unauthorized"
                        }
                    )
                }else{
                    req.user = decoded
                    
                    next()
                    
                }
                
            })
        }else{
                next()
        }
        
       

    }
)


const ConnectionString = process.env.MONGO_URI

mongoose.connect(ConnectionString).then(
    ()=>{
        console.log("database connected");
    }
).catch(()=>{
    console.log("failed connect to DB");
})


app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/orders", orderRouter )
app.use("/reviews", reviewRouter)



app.listen(5000, ()=>{
    console.log("Server Is Running");
})