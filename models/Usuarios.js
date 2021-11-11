const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Usuario = new Schema({
    nome:{
        type: String
    },
    email:{
        type: String
    },
    senha:{
        type: String
    }
})


mongoose.model("usuarios" , Usuario)