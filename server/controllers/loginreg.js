const { json } = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require("mongodb"), ObjectId = mongodb.ObjectID
const Restaurant  = mongoose.Model('Restaurant')
const Customer = mongoose.Model('Customer')
import jwt from 'jsonwebtoken';
import passport from 'passport';

module.exports={
    restaurantRegister:(req,res,next)=>{
        passport.authenticate('registerRestaurant', (err, user, info) => {
            if (err) {
              console.log(err);
            }
            if (info != undefined) {
              console.log(info.message);
              res.send(info.message);
            } else {

              //req.logIn is a passport method that once completed, assigns the user data under req.user. it's purely for back end  
              //seems excessive since the registerRestaurant Strategy already creates the user. The documentation argues that it's for modularization
              //"I could have passed this extra data through to the middleware as well, but I want Passport to only handle authentication, not user creation as well. Modularization"
              //user is passed from registerRestaurant strategy in passport-auth.js where the entire document is passed forward, including _id
              req.logIn(user, err => {
                const data = {
                  _id:req.body.id,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  email: req.body.email,
                  
                };
                Restaurant.findOne({
                  where: {
                    _id: data._id,
                  },
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
                        //_http.registerRestaurant(newRestaurant)
                        //_http.loginRestaurant(newRestaurantEmailAndPassword)
                      console.log('user created in db');
                      
                      res.status(200).send({ message: 'user created' });
                    });
                });
              });
            }
          })(req, res, next);
    },
    restaurantLogin:(req,res,next)=>{
        passport.authenticate('loginRestaurant', (err, user, info) => {
            if (err) {
              console.log(err);
            }
            if (info != undefined) {
              console.log(info.message);
              res.send(info.message);
            } else {
              req.logIn(user, err => {
                Restaurant.findOne({
                  where: {
                    _id: user._id,
                  },
                }).then(user => {
                    //this is where the token is signed and passed to the front end
                  const token = jwt.sign({ id: user.username }, jwtSecret.secret);
                  //OR store it in a cookie for security res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
                  res.status(200).send({
                    auth: true,
                    token: token,
                    message: 'user found & logged in',
                  });
                });
              });
            }
          })(req, res, next);

    },
    customerLogin:(req,res,next)=>{

    },
    customerRegister:(req,res,next)=>{

    }
}