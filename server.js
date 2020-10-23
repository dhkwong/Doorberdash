require('./server/config/database');
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const bp = require('body-parser');


const passport = require('passport')
// or wherever you choose to set up passport logic
// require('./config/passport')
app.use(passport.initialize())
const router = require('./server/routes');
app.use(express.urlencoded({extended: true}));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())
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
