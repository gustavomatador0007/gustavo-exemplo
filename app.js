// CHAMANDO AS DEPENDÊNCIAS
const express = require("express")
const bodyparser = require("body-parser")
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")
require("./models/Categoria")
require("./models/Usuarios")
const usuarios = mongoose.model("usuarios")
const categoria = mongoose.model("categoria")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")
const bcrypt = require("bcryptjs")
const passport = require("passport")
require("./config/auth")(passport)
const server = express()

// CONFIGURANDO AS DEPENDÊNCIAS
// CONFIGURANDO O HANDLEBARS
server.engine("handlebars", handlebars({ defaultLayout: "main" }))
server.set("view engine", "handlebars")

// CONFIGURANDO O BODY-PARSER
server.use(bodyparser.urlencoded({ extended: true }))
server.set(bodyparser.json())

// CONFIGURANDO AS SESSÕES
server.use(session({
  secret: "qeqw0dwq90kfp0s9",
  resave: true,
  saveUninitialized: true
}))

server.use(passport.initialize())
server.use(passport.session())

// CONFIGURANDO O MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/CadastroCategorias").then(() => {
  console.log("CONECTADO AO BANCO DO MONGO DB")
}).catch((failed) => {
  console.log("ERRO AO SE CONECTAR AO BANCO DO MONGO" + failed)
})

// CHAMANDO AS ROTAS PRINCIPAIS
server.get("/", (req, res) => {
  res.render("admin/home")
})

server.get("/listarRegistros", (req, res) => {
  categoria.find().lean().then((categorias) => {
    res.render("admin/listar", { categorias })
  }).catch((errorMsg) => {
    console.log("erro: " + errorMsg)
  })
})

server.get("/edit/:id", (req, res) => {
  categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
    res.render("admin/edit", { categoria: categoria })
  }).catch((nao) => {
    console.log("nao foi mano!: " + nao)
  })
})

server.post("/categorias/edit", (req, res) => {
  categoria.findOne({ _id: req.body.id }).then((categoria) => {
    categoria.Linguagem = req.body.language,
      categoria.Desc = req.body.description

    categoria.save().then(() => {
      res.redirect("/listarRegistros")
    }).catch((errormsg1) => {
      res.send(errormsg1)
    })
  }).catch((erro1) => {
    res.send(erro1)
  })
})

server.post("/deletar", (req, res) => {
  categoria.deleteOne({ _id: req.body.id }).then(() => {
    res.send("deletado com sucesso!")
  }).catch((errorDelete) => {
    res.send("erro ao deletar!" + errorDelete)
  })
})

server.get("/criarConta", (req, res) => {
  res.render("admin/criarConta")
})

server.get("/login", (req, res) => {
  res.render("admin/login")
})

// var message = "Hesdfsdllo";

// server.get('/hello',

//   (request, response, next) => {
//     message = "Carrro";

//     next();
//   },

//   (request, response) => {
//     return response.send(message);
//   });

// server.post("/loginPage", (req, res, next) => {
//   const a = passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "login"
//   })

//   console.log(a)

// })
server.post(
  "/loginPage",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login"
  })
)


// CADASTRO DE USUARIOS
server.post("/sendProfile", (req, res) => {
  var erros = []

  if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined) {
    erros.push({ text: "Aconteceu algum erro! Preencha o campo nome" })
  }

  if (!req.body.email || req.body.email == null) {
    erros.push({ text: "Aconteceu algum erro! Preencha o email" })
  }

  if (!req.body.senha || req.body.senha == null) {
    erros.push({ text: "Aconteceu algum erro! Preencha sua senha" })
  }

  if (req.body.senha.length < 4) {
    erros.push({ text: "a senha é muito fraca!" })
  }

  if (req.body.senha !== req.body.senha2) {
    erros.push({ text: "As senhas não são iguais" })
  }

  if (erros.length > 0) {
    res.render("admin/criarConta", { erros: erros })
  } else {
    usuarios.findOne({ email: req.body.email }).then(async (usuario) => {
      if (usuario) {
        res.send("Este Email já está em uso! Tente outro")
      } else {
        let novoUsuario = await usuarios.create({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        });

        // const novoUsuario = new usuarios({
        //   nome: req.body.nome,
        //   email: req.body.email,
        //   senha: req.body.senha
        // })

        // bcrypt.genSalt(10, (erro, salt) => {
        const hash = await bcrypt.hash(novoUsuario.senha, 8);

        // bcrypt.hash(novoUsuario.senha, 8, (erro, hash) => {
        // if (erro) {
        //   res.send("houve um erro durante o salvamento!")
        // }

        novoUsuario.senha = hash

        novoUsuario.save().then(() => {
          res.send("Conta criada com sucesso!")
        }).catch((errormsg2) => {
          res.send(errormsg2)
        })
        // })
        // })
      }
    }).catch((erro) => {
      res.send("erro" + erro)
    })
  }

})

// CHAMANDO AS ROTAS SECUNDARIAS
const cadastro = require('./routes/categorias')
server.use("/categorias", cadastro)

// ENVIANDO AS INFORMAÇÕES PARA O BANCO DE DADOS
cadastro.post("/newCategory", (req, res) => {
  var erros = []
  if (!req.body.language || req.body.language == null || typeof req.body.language == undefined) {
    erros.push({ text: "Aconteceu algum erro! Linguagem é muito pequena" })
  }

  if (!req.body.description || req.body.description == null) {
    erros.push({ text: "Aconteceu algum erro! A descrição não é válida" })
  }

  if (erros.length > 0) {
    res.render("admin/criarCategorias", { erros: erros })
  } else {
    const newCategory = {
      Linguagem: req.body.language,
      Desc: req.body.description
    }

    new categoria(newCategory).save().then(() => {
      res.render("admin/home")
    }).catch((erroCad) => {
      res.send("erro" + erroCad)
    })
  }
})


server.get('/test', async (request, response) => {
  const password = '1234';
  const hash = '$2a$08$B8OnNhYWSkvi9xe0K2dfIe691Vfe/c48.SzaLp2YZpi.PgY6XRt8m'//await bcrypt.hash(password, 8);

  const match = await bcrypt.compare(password, hash);

  return response.json({ password, hash, match })
})

// CHAMANDO E CONFIGURANDO A PORTA
const porta = 8081
server.listen(porta, () => {
  console.log("   ***SERVIDOR RODANDO***  ")
})