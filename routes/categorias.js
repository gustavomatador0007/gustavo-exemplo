// CHAMANDO O EXPRESS
    const express = require("express")
    const cadastro = express.Router()
    

    cadastro.get("/criarCategoria",(req,res)=>{
        res.render("admin/criarCategorias")
    })

    

    module.exports = cadastro
