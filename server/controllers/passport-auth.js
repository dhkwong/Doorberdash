const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const BCRYPT_SALT_ROUNDS = 12
const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    JWTStrategy = require('passport-jwt').Strategy
const Restaurant = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')
//placed here for testing purpose right now, move to env variable once testing is done
const jwtsecret = 'tempjwtsecret',
    ExtractJWT = require('passport-jwt').ExtractJwt;

    
//jwt key info for jwt verification
const opts = {
    //extracts token from header using jwt ExtractJWT
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtsecret
};

passport.use(
    'jwt-restaurant',
    //opts extracts token to be handled using ExtractJWT and jwtSecret key
    new JWTStrategy(opts, (jwt_payload, done) => {
        try {
            console.log('extrating jwt from header in jwt-restaurant from passport-auth')
            console.log(jwt_payload)
            Restaurant.findOne({
                
                    //token only holds extracted and decrypted jwt userid
                    _id: jwt_payload.id
                
            }).then(restaurant => {
                if (restaurant) {
                    console.log('restaurant found in db in passport');
                    // note the return removed with passport JWT - add this return for passport local
                    //return done causes the function to end right there. done
                    done(null, restaurant);
                } else {
                    console.log('restaurant not found in db');
                    done(null, false);
                }
            });
        } catch (err) {
            done(err);
        }
    }),
);
//restaurant verification Strategy logic. Both Local and JWT
passport.use('registerRestaurant',
    //Default localStrategy expects credentials in params username and password. Changed params to 'email' and 'password'
    new localStrategy({
        //set usernamefield to look for field email
        usernameField: 'email',
        //set passwordfield to look for field password
        passwordField: 'password',
        //deactivate session as we're using JWT
        session: false,
        //enable req in localStrategy
        passReqToCallback:true
    },
        (req,email, password, done) => {
            
            try {
                Restaurant.findOne({
                    
                        email: email
                    
                }).then(user => {
                    console.log(`user in passport auth: ${user}`)
                    if (user !== null) {
                        console.log('email already taken');
                        return done(null, false, { message: 'email already taken' });
                    } else {
                        bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                            //create new restaurant document to save
                            // let newRestaurant = new Restaurant(user)
                            // newRestaurant.password = hashedPassword
                            // newRestaurant.save()
                            //     .then(user => {

                            //         console.log('restaurant created');
                            //         // note the return needed with passport local - remove this return for passport JWT to work
                            //         //returns the entire user theoretically, including _id for us to use in loginreg.js
                            //         return done(null, user);
                            //     })
                            //originally only partly creates the Restaurant document for modularization.loginreg.js 
                            //In case newRestaurant.save() doesnt work

                            // console.log(req.body)
                            //creates restaurant but doesnt return, aka the request never ends
                            Restaurant.create({
                                name: req.body.name,
                                email: email,
                                description: req.body.description,
                                password: hashedPassword
                            }).then(user => {
                                console.log('user created');
                                // note the return needed with passport local - remove this return for passport JWT to work
                                return done(null, user);
                            });
                        });
                    }
                });
            } catch (err) {
                done(err);
            }
        }
    )
)
//logs in restaurant
passport.use('loginRestaurant',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false
        },
        (email, password, done) => {
            try {
                Restaurant.findOne({
                    
                        email: email
                    
                }).then(restaurant => {
                    //no restaurant
                    if (restaurant === null) {
                        //done is a method called internally by Strategy implementation.Then navigates to one internal success / error / fail methods. similar to next. also, allows you to pass forward a user/an object
                        return done(null, false, { message: 'bad username' });
                    } else {
                        bcrypt.compare(password, restaurant.password).then(response => {
                            if (response !== true) {
                                console.log('passwords do not match');
                                return done(null, false, { message: 'passwords do not match' });
                            }
                            console.log('restaurant found & authenticated in Login');
                            // note the return needed with passport local - remove this return for passport JWT
                            return done(null, restaurant);
                        })
                    }
                })
            } catch (err) {
                done(err);
            }
        }
    )
)



/**
 * 
 * 
 * 
 * 
 * //customer verification Strategy logic
 * 
 * 
 * 
 * 
 * 
 * 
 */

//registers restaurant
passport.use('registerCustomer',
    //Default localStrategy expects credentials in params username and password. Changed params to 'email' and 'password'
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        //need this to pass req into localStrategy
        passReqToCallback:true
    },
        (req,email, password, done) => {
            try {
                Customer.findOne({
                    
                        email: email,
                    
                }).then(user => {
                    if (user != null) {
                        console.log('email already taken');
                        return done(null, false, { message: 'email already taken' });
                    } else {
                        bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                            //create new restaurant document to save
                            let newCustomer = new Customer(req.body)
                            newCustomer.password = hashedPassword
                            newCustomer.save()
                                .then(user => {
                                    console.log('Customer created');
                                    // note the return needed with passport local - remove this return for passport JWT to work
                                    return done(null, user);
                                })

                            //In case newCustomer.save() doesnt work
                            //   User.create({ username, password: hashedPassword }).then(user => {
                            //     console.log('user created');
                            //     // note the return needed with passport local - remove this return for passport JWT to work
                            //     return done(null, user);
                            //   });
                        });
                    }
                });
            }catch (err) {
                done(err);
            }
        }
    )
)
//logs in customer
passport.use('loginCustomer',
    new localStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            session: false
        },
        (email, password, done) => {
            try {
                Customer.findOne({
                    
                        email: email
                    
                }).then(customer => {
                    //no customer found
                    if (customer === null) {
                        //done is a method called internally by Strategy implementation.Then navigates to one internal success / error / fail methods. similar to next
                        return done(null, false, { message: 'bad username' });
                    } else {
                        bcrypt.compare(password, customer.password).then(response => {
                            if (response !== true) {
                                console.log('passwords do not match');
                                return done(null, false, { message: 'passwords do not match' });
                            }
                            console.log('customer found & authenticated');
                            // note the return needed with passport local - remove this return for passport JWT
                            return done(null, customer);
                        })
                    }
                })
            } catch (err) {
                done(err);
            }
        }
    )
)
// const opts = {
//     jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
//     secretOrKey: jwtsecret
// };
//verifies customer is logged in/has valid jwt token
passport.use(
    'jwt-customer',
    new JWTStrategy(opts, (jwt_payload, done) => {
        try {
            console.log('extrating jwt from header in jwt-restaurant from passport-auth')
            Customer.findOne({
                
                    //token only holds the userid
                    _id: jwt_payload.id,
                
            }).then(customer => {
                if (customer) {
                    console.log('customer found in db in passport');
                    // note the return removed with passport JWT - add this return for passport local
                    done(null, customer);
                } else {
                    console.log('customer not found in db');
                    done(null, false);
                }
            });
        } catch (err) {
            done(err);
        }
    }),
);
