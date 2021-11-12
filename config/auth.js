const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/Usuarios")
const Usuario = mongoose.model("usuarios")

module.exports = function (passport) {
  passport.use(new localStrategy({ usernameField: "email", passwordField: "senha" }, async (email, senha, done) => {
    // console.log({
    //   email, senha
    // })

    // const user = {
    //   id: 1,
    //   email: 'angeloevan.ane@gmail.com',
    //   senha: '12345678'
    // }

    // const isValid = email === user.email && senha === user.senha;

    // if (isValid) {
    //   return done(null, user)
    // } else {
    //   return done(new Error("User cagado"))
    // }

    const usuario = await Usuario.findOne({ email: email })

    if (!usuario) {
      return done(null, false, { message: "está conta não está registrada!" })
    }

    const match = await bcrypt.compare(senha, usuario.senha);

    if (!match) {
      return done(null, false, { message: "senha inválida!" })
    }

    return done(null, usuario)


    // .then(async (usuario) => {
    //   if (!usuario) {
    //     return done(null, false, { message: "está conta não está registrada!" })
    //   }

    //   const passwordsMatch = await bcrypt.compare(senha, usuario.senha);

    //   if (passwordsMatch) {
    //     return done(null, usuario)
    //   }

    //   return done(null, false, { message: 'senha inválida' })


    //   // bcrypt.compare(senha, usuario.senha, (erro, batem) => {
    //   //   console.log({ erro, batem, senha, hash: usuario.senha })

    //   //   if (!batem) {
    //   //     return done(erro)
    //   //   }


    //   //   return done(null, usuario)
    //   // })
    // }).catch(err => {
    //   return done(err)
    // })
  }))

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })
}