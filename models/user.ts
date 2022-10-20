import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    coupon:{
        type:String
    },
    coupon_type:{
        type:String
    },
    joined:{
       type:String
    },
    total_balance:{
        type:Number
    },
    no_of_mines:{
      type:Number
    },
    mine_balance:{
       type:Number
    },
    mine_duration:{
       type:Number
    },
    mine_earning:{
      type:Number
    },
    mining:{
        type:Boolean
    },
    mining_ends_at:{
       type:Number
    },
    mining_started_at:{
        type:Number
    },
    no_of_logins:{
        type:Number
    },
    referrer:{
        type:String
    },
    no_referrals:{
        type:Number
    },
    referral_balance:{
        type:Number
    }


},{timestamps:true})

const User= mongoose.model('User',UserSchema);

export default User