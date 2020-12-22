require('./server/config/database');
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const bp = require('body-parser');
<<<<<<< HEAD
var cors = require('cors')
=======
// var cors = require('cors')
>>>>>>> 27aa05ac200fe625e098745dbc6805a222dee94d

//if we choose to convert to cookies on server side vs client side
// const cookieParser = require('cookie-parser')
// app.use(cookieParser)
<<<<<<< HEAD
=======

// app.use(cors({exposedHeaders:['Authorization','JWT']}))
>>>>>>> 27aa05ac200fe625e098745dbc6805a222dee94d
const passport = require('passport')
// need this to be able to call the passport strategies created
require('./server/controllers/passport-auth')
app.use(passport.initialize())
// require(path.join(__dirname, 'server/controllers/loginreg'))(passport); //Load passport config
const router = require('./server/routes');
app.use(express.urlencoded({extended: true}));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())
app.use(cors(
//     {
//     'origin':'*',
//     'methods':'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'exposedHeaders':['JWT', 'Authorization']
// }
))
app.use(express.static( path.join(__dirname, './public/dist/public')));

//only need session if we choose not to use JWT
// app.use(session({
//     secret: 'ly0u5iyw81rtwkws',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }
// }));
app.use(router);

app.listen(8000, () => console.log('listening on port 8000'));
