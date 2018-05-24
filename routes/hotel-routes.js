// const express     = require("express");
// const yelpRoutes  = express.Router();
// const request = require('request');
// const cheerio = require('cheerio');


// //grab searchTerm from front end and pass into API 
// yelpRoutes.get('/:searchTerm',(req,res,next) => {

// 'use strict';

// const yelp = require('yelp-fusion');
 
// const client = yelp.client(process.env.apiKey);

// // when using the yelp API only search for hotels
// const term = "hotel"
// // set parameters for yelp API search, response.jsonBody.businesses is an object of each hotel
// client.search({
//   term: term,
//   location: req.params.searchTerm,
//   sort_by: "review_count",
//   limit: 1
// }).then(response => {
//     console.log("there are "+response.jsonBody.businesses.length+" hotels")
//     response.jsonBody.businesses.forEach(hotel => {
//         // begin scrape of reviews of each hotel
//         request(hotel.url, function(error, response, html) {
//         // First we'll check to make sure no errors occurred when making the request
//     if(!error){
//     // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
//     var $ = cheerio.load(html);
    

//    var eachReview = []
    
//     $('.review-content > p ').filter(function(){

//         // Let's store the data we filter into a variable so we can easily see what's going on.

//              var data = $(this);
//              eachReview.push(data.first().text())
            
//          })
//          console.log("there are this many reviews: ", eachReview.length)
//          console.log(eachReview)
//         // IBM watson calls for natural language understanding
//         var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
//         var natural_language_understanding = new NaturalLanguageUnderstandingV1({
//             "username": process.env.username,
//             "password": process.env.password,
//             'version': '2018-03-16'
//         });
//         // loop through each review to pass the text one by one into watson
//         eachReview.forEach(oneReview => {
//         var parameters = {
//             'text': oneReview,
//             'features': {
//                 'sentiment': {}
//             }
//         }

//         natural_language_understanding.analyze(parameters, function (err, response) {
//             if (err)
//                 console.log('error:', err);
//             else
//             // displays what watson feels on each review to terminal
//                 console.log(JSON.stringify(response, null, 2));
//         });
//     })
// }

//         })
//     });

//     res.json(response.jsonBody.businesses)
  
// }).catch(e => {
//   console.log(e);
// });

// });
 
// module.exports = yelpRoutes;

