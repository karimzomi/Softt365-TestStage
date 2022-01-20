const Express = require("express");
const cors = require('cors')
const app = Express();
const CalculRouter = require('./router/calcul')
/*const dotenv = require('dotenv');
dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 8080*/


/*Utilisation de format json pour communication
* Entre client-serveur
*/
app.use(Express.json())
app.use(cors())
app.use('/',CalculRouter)
app.listen(8080,()=>{
    console.log(`💻 server is running : http://localhost:${8080}`);
})