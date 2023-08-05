import mongoose from "mongoose";

const epidemieSchema = new mongoose.Schema({
    R :{type: Number,
        required: true} ,
    DD : {type: Number,
        required: true}
})

export default mongoose.model("Epidemie", epidemieSchema)