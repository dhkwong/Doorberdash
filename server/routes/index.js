const express = require('express');
const router = express.Router();
const catchallRoute = require('./catchall.routes');
const apiRouter = express.Router();
const restaurantRoutes = require('./restaurant.routes');

// api/restaurants
apiRouter.use('/restaurants', restaurantRoutes);
const customerRoutes = require('./customer.routes');
// api/customers
// express.Router().use('/customers, router.get('/events', function (req, res, next) { logic here }))
apiRouter.use('/customers', customerRoutes);
router.use('/api', apiRouter)
  .use(catchallRoute);
module.exports = router;
