//for authenticating and finding user's jwt tokens
//may not need this, might be able to push the jwt-restaurant authorization strategy over to the general findOne for restaurant and customer
/*
*
app.get('/findUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {}
}
*        
*/
import passport from 'passport';
module.exports={
    //example for restaurant.js
    findRestaurant: (req, res, next) => {
        //if authentication of jwt token goes through, restaurant object is passed through
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
          if (err) {
            console.log(err);
          }
          if (info != undefined) {
            console.log(info.message);
            res.json(info.message);
          } else {
            console.log('restaurant found in db from route');
            //I'll choose to res just the id and email. This is going to be just for JWT verification. For modularity, I'll do a second query for all restaurant data. Or, i'll just change all queries in restaurants.js to accomodate for passport authentication
            res.status(200).json({
              auth: true,
              
              email:restaurant.email,
              _id:restaurant._id,
            
            //   email: restaurant.email,
            //   name: restaurant.name,
            //   password: restaurant.password,
              message: 'restaurant found in db',
            });
          }
          //return (req,res,next) as a callback
        })(req, res, next);
}
}