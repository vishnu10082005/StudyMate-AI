import mongoose from "mongoose";
const paymentschema = new mongoose.Schema({
    razorpay_order_id:{
        type:String,
        required:true,
    },
    razorpay_payment_id:{
        type:String,
        required:true,
    },
    razorpay_signature:{
        type:String,
        required:true,
    },
})

const Payment =mongoose.model("Payment",paymentschema);
export default Payment