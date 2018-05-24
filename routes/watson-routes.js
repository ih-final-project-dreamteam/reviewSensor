const express     = require("express");
const watsonRoutes  = express.Router();
const axios = require("axios"); // used to call our own hotel list API

watsonRoutes.get('/:searchTerm/:id', (req,res,next) => { 
searchTerm = req.params.searchTerm;
hotelID = req.params.id;
console.log('inside route!')
console.log('jksdhafkjadshkjfldsakhk')

next();
});// end of watson route

module.exports = watsonRoutes;