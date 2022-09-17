//* Dependencias
const express = require("express");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express")
const path = require('path')
require("./middleware/auth.middleware")(passport);

//*Archivos de rutas
const userRouter = require("./users/users.router").router;
const authRouter = require("./auth/auth.router").router;
const accomodationRouter = require("./accommodations/accommodations.router").router
const reservationRouter = require('./reservations/reservations.router').router

const Accommodations = require('./models/accommodations.model')
const initModels = require('./models/initModels')
//const defaultData = require('./utils/defaultData')
const swaggerDoc = require('./swagger.json') 

//* Configuraciones iniciales

const {db} = require('./utils/database')

//* Configuraciones iniciales
const app = express();

initModels()

db.authenticate()
  .then(() => console.log('Database Authenticated'))
  .catch(err => console.log(err))

if(process.env.NODE_ENV === 'production'){
  db.sync() 
    .then(() => {
      console.log('Database synced')
      //defaultData()
    })
    .catch(err => console.log(err))
} else{
  db.sync({force:true})
    .then(() => {
      console.log('Database synced')
      //defaultData()
    })
    .catch(err => console.log(err))
  }


//? Esta configuracion es para habilitar el req.body
app.use(express.json());


app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accommodations", accomodationRouter)
app.use("/api/v1/reservations", reservationRouter)
app.use("/v1/doc", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get("/api/v1/uploads/:imgName", (req ,res) => {
  const imgName = req.params.imgName;
  res.status(200).sendFile(path.resolve('uploads/') + '/' +imgName)
})

app.get("/ejemplo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res
      .status(200)
      .json({
        message: "Felicidades, tienes credenciales para entrar aqui",
        email: req.user.email,
      });
  }
);

PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

exports.default = app
exports.app = app
module.exports = app