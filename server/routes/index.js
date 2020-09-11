const express = require('express');
const router = express.Router();
const catchallRoute = require('./catchall.routes');
const apiRouter = express.Router();
const restaurantRoutes = require('./restaurant.routes');
apiRouter.use('/restaurants', restaurantRoutes);
//test to see if the route ends up being /api/restaurants/customers OR just/api/customers and /api/restaurants separately
const customerRoutes = require('./customer.routes');
apiRouter.use('/customers', customerRoutes);
router.use('/api', apiRouter)
  .use(catchallRoute);
module.exports = router;
