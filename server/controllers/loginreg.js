
const jwt = require('jsonwebtoken');
const passport = require('passport');

const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant');
const Customer = mongoose.model('Customer');
// import jwt from 'jsonwebtoken';
//temporary jwt secret. move to env variable after testing
const jwtSecret = 'tempjwtsecret';
// import passport from 'passport'

module.exports = {
  //WORKING
  //route: localhost:8000/api/restaurants/restaurantregister
  restaurantRegister: (req, res, next) => {
    passport.authenticate('registerRestaurant', (err, user, info) => {
      try {
        console.log(`req.body: ${JSON.stringify(req.body)}`)
        if (err) {
          console.log(err);
          res.json(err)
        }
        if (info != undefined) {
          console.log(info.message);
          res.json({ message: "error in restaurantRegister info.message " + info.message, error: info.message });
        } else {

          //req.logIn is a passport method that once completed, assigns the user data under req.user. it's purely for back end  
          //user is passed from registerRestaurant strategy in passport-auth.js where the entire document is passed forward, including _id
          req.logIn(user, err => {
            const data = {
              _id: user._id,
              name: req.body.name,
              email: req.body.email,

            };
            console.log(`data: ${JSON.stringify(data)}`)
            Restaurant.findOne({

              _id: data._id,
              // email:req.body.email

            }).then(user => {
              try {

                const token = jwt.sign({ id: user._id }, jwtSecret)
                let temprestaurant = user.toJSON()
                //hide id and pass
                delete temprestaurant.password
                delete temprestaurant._id
                //if header doesnt work, use .setHeader("JWT",token)
                //alternatively, could send the token in the response body to be moved to cookies from there

                // res.header("JWT",token)
                // res.json({ message: 'Restaurant created', restaurant: temprestaurant })
                console.log("temprestaurant: " + temprestaurant)
                // res.header("JWT",token).json({restaurant: temprestaurant })
                res.header("JWT", token).json({ restaurant: temprestaurant })

              } catch (error) {
                res.json({ error: 'error at restaurantRegister Restaurant.findOne: ' + error })
              }
            })

          });
        }
      }
      catch (error) {
        res.json({ message: "error in loginreg.js restaurantRegister", error: error })
      }
    })(req, res, next);

  },
  //WORKING
  restaurantLogin: (req, res, next) => {
    passport.authenticate('loginRestaurant', (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.json(info.message);
      } else {
        req.logIn(user, err => {
          Restaurant.findOne({

            _id: user._id,

          }).then(user => {
            //this is where the token is signed and passed to the front end.
            //HOWEVER it's not passed to the req.header
            const token = jwt.sign(
              { id: user._id },
              jwtSecret,
              //  {expiresIn:'60m'} //1 hour
            );
            //OR store it in a cookie for security res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
            //need to find out how to assign bearer token to header 
            //OR through res.cookie. Might be better
            // res.status(200).json({
            //   auth: true,
            //   token: token,
            //   Authorization: token,
            //   message: 'Restaurant user found & logged in',
            // });
            // var jwtExpirySeconds = 999
            // res.cookie("JWT", token, { maxAge: jwtExpirySeconds * 1000 })
            //sets header and returns a json response

            //for cookie option. httpOnly makes it protected from being visible through js, and prevents XSS attacks. Consequently the server side will see the cookie in req.cookie.token or.cookie.jwt whatever you name it

            //look up cookieparser
            // app.use(cookieParser());
            // app.use(
            //   jwt({
            //     secret: 'secret123',
            //     getToken: req => req.cookies.token
            //   })
            // );

            // app.get('/jwt', (req, res) => {
            //   const token = jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret);
            //   res.cookie('token', token, { httpOnly: true });
            //   res.json({ token });
            // });
            let temprestaurant = user.toJSON()
            delete temprestaurant.password
            res.header("JWT", token).json({ login: true, restaurant: temprestaurant })
          })
            .catch(err => {
              res.json({ error: err })
            })
        });
      }
    })(req, res, next);

  },
  //WORKING
  customerRegister: (req, res, next) => {
    passport.authenticate('registerCustomer', (err, user, info) => {
  

      //try catch returned error if no user was created
      // try{
      if (err) {
        console.log("err here: "+ JSON.stringify(err));
        res.json({ message: "error in loginreg.js customerRegister: "+err, error: err })
      }
      else if (user === null) {
        res.json({ message: "error in loginreg.js customerRegister user undefined: " + err, error: err })
      }
      else if (info != undefined) {
        console.log("customerRegister info: "+info.message);
        res.json(info.message);
      } else {

        //req.logIn is a passport method that once completed, assigns the user data under req.user. it's purely for back end  
        //seems excessive since the registerCustomer Strategy already creates the user. The documentation argues that it's for modularization
        //"I could have passed this extra data through to the middleware as well, but I want Passport to only handle authentication, not user creation as well. Modularization"
        //user is passed from registerCustomer strategy in passport-auth.js where the entire document is passed forward, including _id
        req.logIn(user, err => {
          console.log("loginreg customerRegister req.login user: " + JSON.stringify(user))
          const data = {
            _id: user._id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,

          };
          console.log("loginreg customerRegister req.login data: " + JSON.stringify(data))
          //error handling
              /**
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * WORKING HERE
       * 
       * 
       * //ERROR: testing err: Error: Failed to serialize user into session WORKING
       * error 2: Email uniqueness from passort-auth not recieved by customerRegister
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       * 
       */
          if (err) {
            //if error return formatted errors to be displayed. user contains errors since we pass them from passport-auth
            console.log("testing err: "+err)
            const errors = Object.keys(user.errors).map(key => user.errors[key].message);
            console.log("errors req.login customerReg loginreg: " + JSON.stringify(errors))
            // console.log("loginreg customerRegister req.login err error: "+errors)
            // console.log("loginreg customerRegister req.login err user: "+JSON.stringify(user))
            res.json({ error: errors })
          }
          // else{
          Customer.findOne({ _id: data._id, })

            .then(user => {
              //previously added customer data here, but it's all in passport-auth now
              // user
              //   .update({
              //     // first_name:data.first_name,
              //     // last_name: data.last_name,
              //     // email: data.email,
              //     firstname : req.body.firstname,
              //     lastname: req.body.lastname,
              //     email: req.body.email

              //   })
              //   .then(() => {
              //     //note that it does NOT login the user. Theoretically should have to do that front end. 
              //     //_http.registerCustomer(newCustomer)
              //     //_http.loginCustomer(newCustomerEmailAndPassword)
              //     console.log('user created in db');

              //     res.status(200).json({ message: 'user created' });
              //   });
              try {
                const token = jwt.sign({ id: user._id }, jwtSecret)
                let tempcustomer = user.toJSON()
                //remove hashed pass before returning to client side
                delete tempcustomer.password
                res.header("JWT", token).json({ login: true, message: 'Customer created', customer: tempcustomer })

              } catch (error) {
                res.json({ message: "error in customer.findOne customerRegister", error: err })
              }
            })
            .catch(err => {
              console.log("err: " + JSON.stringify(err))
              res.json({ message: "error in loginreg.js customerRegister", error: err })
            })
          // }
        });
      }
      // }
      // catch (error) {
      //   console.log("loginReg customerRegistration error: "+error)
      //   res.json({ message: "caught error in loginreg.js customerRegister", error: error })
      // }

      //setup for callback capabilities
    })(req, res, next);
  },
  //WORKING
  customerLogin: (req, res, next) => {
    passport.authenticate('loginCustomer', (err, user, info) => {
      if (err) {
        console.log(err)
      }
      if (info != undefined) {
        //info means that the authentication failed, so return the error message
        console.log(info.message)
        res.json(info.message)
      } else {
        //else authentication succeeded and continue
        //passport req.logIn creates a req.user field with the logged in user's data. user._id, user.order, user.name, ect

        req.logIn(user, err => {
          //mongoose findOne query
          Customer.findOne({

            _id: user._id

          }).then(user => {
            //create signed token
            const token = jwt.sign({ id: user._id }, jwtSecret)
            // res.status(200).json({
            //   auth: true,
            //   token: token,
            //   message: 'Customer user found & logged in'
            // });
            let tempcustomer = user.toJSON()
            delete tempcustomer.password
            res.header("JWT", token).json({ login: true, customer: tempcustomer })
          })
            .catch(err => {
              res.json({ error: err })
            })

        });
      }

    })
      //allows for callback
      (req, res, next);

  }

}