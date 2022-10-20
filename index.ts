import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createClient } from "redis";
import mongoose from "mongoose"
import User from "./models/user";
import Event from "events";
import RedisEventAdapter from "./event-adapter";


dotenv.config();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const redis = createClient({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
})

const redisAdapter = new RedisEventAdapter(redis as any);


app.get("/get-user/:userId", async ( req: Request, res: Response )=>{

    const user_id = req.params.userId;
    
    try{
        const user = await redisAdapter.get( user_id );
        res.json( {...JSON.parse(user), cache_status: "hit"} );
        console.log("Cache hit");

    }catch(err: any){

        console.log("Cache miss")
        const user = await User.findById( user_id );
        redisAdapter.emit("set-cache", user_id, JSON.stringify( user ));
        res.json( {...user, cache_status: "miss"} )
    }
    
})

app.patch("/update-user/:userId", async ( req: Request, res: Response ) => {
    const user_id = req.params.userId;

    const updated_user = await User.findByIdAndUpdate( user_id, req.body.update, { new: true} );

    redisAdapter.emit("set-cache", user_id, JSON.stringify(updated_user));

    res.json(updated_user)
})

redis.on("error", err => console.log(err) );
const promiseArray = [ redis.connect(), mongoose.connect( process.env.MONGO_DB_URL as string ) ];

Promise.all( promiseArray )
.then( ()=> app.listen(3000, ()=> console.log("Server is up and running ")));

















