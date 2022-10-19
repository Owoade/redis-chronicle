import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createClient } from "redis";
import axios from "axios";


dotenv.config();

const app = express();

const redis = createClient({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
})

redis.on("error", err => console.log(err) )

app.get("/", async function( req: Request, res: Response){
   const user = await redis.get("user");
   console.log(user);
   res.send(user)
})

app.get("/currency/:currencyCode", async function( req: Request, res: Response){
    const { currencyCode } = req.params;
    redis.get(currencyCode)
    .then( async (rates)=>{
        if(rates == null){
            console.log("Cache miss");
            // Get data from api end point
            const API_KEY = process.env.RAPID_API_KEY;
            const ax_res = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currencyCode}`);
            res.json(ax_res.data.conversion_rates);
            // Error Handling
            if( ax_res.data.result === "success" ){
                const conversion_rates = JSON.stringify(ax_res.data.conversion_rates)
                await redis.setEx( currencyCode, 1000, conversion_rates )
            }
            
            return
        }
        console.log("Cache hit")
        return res.json( JSON.parse(await redis.get(currencyCode) as string) ) 

    })
})

redis.connect()
.then(()=> app.listen(3000, () => console.log("Redis and the server are live!!!")))




