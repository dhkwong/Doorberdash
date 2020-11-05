
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
  //Moving methods to restaurants doesnt work, but also the all method doesnt work here
  //route looks like this:
  //localhost:8000/api/restaurants/restaurantregister
  restaurantRegister: (req, res, next) => {
    passport.authenticate('registerRestaurant', (err, user, info) => {
      console.log(`req.body: ${JSON.stringify(req.body)}`)
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.json(info.message);
      } else {

        //req.logIn is a passport method that once completed, assigns the user data under req.user. it's purely for back end  
        //seems excessive since the registerRestaurant Strategy already creates the user. The documentation argues that it's for modularization
        //"I could have passed this extra data through to the middleware as well, but I want Passport to only handle authentication, not user creation as well. Modularization"
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
            //returned null originally since findOne couldnt find the user?
            // email:req.body.email

          }).then(user => {
            //user currently passing in null
            console.log(`req.body: ${req.body}`)
            console.log(`user: ${user}`)
            
            user
              .update({
                name: req.body.name,
                description:req.body.description
              })
              .then(() => {
                //note that it does NOT login the user. Theoretically should have to do that front end. 
                //_http.registerRestaurant(newRestaurant)
                //_http.loginRestaurant(newRestaurantEmailAndPassword)
                console.log('user created in db');

                res.json({ message: 'user created' });
              });
          });
        });
        // res.json({message:"test error"})
      }
    })(req, res, next);

  },
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
               {expiresIn:'1h'}
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
            
            res.header("JWT", token).json({login:true, restaurant:user})
            res.end();
          });
        });
      }
    })(req, res, next);

  },
  customerLogin: (req, res, next) => {
    passport.authenticate('registerCustomer', (err, user, info) => {
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
            const token = jwt.sign({ _id: user._id }, jwtSecret)
            res.status(200).json({
              auth: true,
              token: token,
              message: 'Customer user found & logged in'
            });
          });

        });
      }

    })
      //allows for callback
      (req, res, next);

  },
  customerRegister: (req, res, next) => {
    passport.authenticate('registerCustomer', (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.json(info.message);
      } else {

        //req.logIn is a passport method that once completed, assigns the user data under req.user. it's purely for back end  
        //seems excessive since the registerCustomer Strategy already creates the user. The documentation argues that it's for modularization
        //"I could have passed this extra data through to the middleware as well, but I want Passport to only handle authentication, not user creation as well. Modularization"
        //user is passed from registerCustomer strategy in passport-auth.js where the entire document is passed forward, including _id
        req.logIn(user, err => {
          const data = {
            _id: req.body.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,

          };
          Customer.findOne({
            
              _id: data._id,
            
          }).then(user => {
            //no idea why she updated here
            user
              .update({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
              })
              .then(() => {
                //note that it does NOT login the user. Theoretically should have to do that front end. 
                //_http.registerCustomer(newCustomer)
                //_http.loginCustomer(newCustomerEmailAndPassword)
                console.log('user created in db');

                res.status(200).json({ message: 'user created' });
              });
          });
        });
      }
      //setup for callback capabilities
    })(req, res, next);
  }
}