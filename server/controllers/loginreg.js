const { json } = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require("mongodb"), ObjectId = mongodb.ObjectID
const Restaurant  = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')
// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken')
//temporary jwt secret. move to env variable after testing
const jwtSecret = 'tempjwtsecret'
// import passport from 'passport'
const passport = require('passport')

module.exports = {
    restaurantRegister:(req,res,next)=>{
        passport.authenticate('registerRestaurant', (err, user, info) => {
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
                  _id:req.body.id,
                  name:req.body.name,
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
                      name:data.name,
                      email: data.email,
                    })
                    .then(() => {
                        //note that it does NOT login the user. Theoretically should have to do that front end. 
                        //_http.registerRestaurant(newRestaurant)
                        //_http.loginRestaurant(newRestaurantEmailAndPassword)
                      console.log('user created in db');
                      
                      res.status(200).json({ message: 'user created' });
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
              res.json(info.message);
            } else {
              req.logIn(user, err => {
                Restaurant.findOne({
                  where: {
                    _id: user._id,
                  },
                }).then(user => {
                    //this is where the token is signed and passed to the front end
                  const token = jwt.sign({ id: user._id }, jwtSecret);
                  //OR store it in a cookie for security res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
                  res.status(200).json({
                    auth: true,
                    token: token,
                    message: 'Restaurant user found & logged in',
                  });
                });
              });
            }
          })(req, res, next);

    },
    customerLogin:(req,res,next)=>{
        passport.authenticate('registerCustomer',(err,user,info)=>{
            if(err){
                console.log(err)
            }
            if(info!=undefined){
                //info means that the authentication failed, so return the error message
                console.log(info.message)
                res.json(info.message)
            }else{
                //else authentication succeeded and continue
                //passport req.logIn creates a req.user field with the logged in user's data. user._id, user.order, user.name, ect
                req.logIn(user,err=>{
                    //mongoose findOne query
                    Customer.findOne({
                        where:{
                            _id:user._id
                        }
                    }).then(user=>{
                        //create signed token
                        const token = jwt.sign({_id:user._id},jwtSecret)
                        res.status(200).json({
                            auth:true,
                            token:token,
                            message:'Customer user found & logged in'
                        });
                    });

                });
            }

        })
        //allows for callback
        (req,res,next)

    },
    customerRegister:(req,res,next)=>{
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
                  _id:req.body.id,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  email: req.body.email,
                  
                };
                Customer.findOne({
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
    },
}