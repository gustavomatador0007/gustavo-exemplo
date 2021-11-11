const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Categoria = new Schema({
    Linguagem:{
        type: String
    },
    Desc:{
        type: String
    }
})


mongoose.model("categoria" , Categoria)
