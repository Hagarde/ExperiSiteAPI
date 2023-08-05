import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    epidemie : {type : mongoose.Schema.Types.ObjectId, ref : "Epidemie"},
    migration : { type : String, required : true }, 
    t : { type: Number, required : true}, 
    initialisation : { type: String, required : true}, 
    acceleration : {type: Boolean, required : true}
})

export default mongoose.model("Experience", experienceSchema)