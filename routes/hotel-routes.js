const express     = require("express");
const yelpRoutes  = express.Router();
const request = require('request'); // needed for webscraping reviews
const cheerio = require('cheerio'); // needed for webscraping reviews
// const twilio = require('twilio');

//grab searchTerm from front end and pass into API 
yelpRoutes.get('/:searchTerm/:priceTerm',(req,res,next) => {
var price = req.params.priceTerm.length
console.log(price)
var priceStr = ''
for (var i = 1; i <= price; i++){
   if (i === price) {
    priceStr += i;
   }
   else {
    priceStr += i+',';
   }
}

console.log(priceStr);
// const accountSid = process.env.twilioKey; // Your Account SID from www.twilio.com/console
// const authToken = process.env.twilioToken;   // Your Auth Token from www.twilio.com/console

// const twilioClient = new twilio(accountSid, authToken);

// twilioClient.messages.create({
//     body: 'Hello from Node',
//     from: '+15005550006', // From a valid Twilio number
//     to: '+17867684353' // Text this number
// })
// .then((message) => console.log(message.sid))
// .done();
'use strict';

const yelp = require('yelp-fusion');
 
const yelpClient = yelp.client(process.env.apiKey);


// when using the yelp API only search for hotels
const term = "hotel";
// array of objects to pass to json
const hotelsInfo = [];

// set parameters for yelp API search, response.jsonBody.businesses is an object of each hotel
yelpClient.search({
  term: term,
  location: req.params.searchTerm,
  sort_by: "review_count",
  limit: 5,
  price: priceStr
}).then(response => {

    console.log("there are "+response.jsonBody.businesses.length+" hotels")
    
    response.jsonBody.businesses.forEach(hotel => {
        // define an empty object that we will use to populate all our hotel info
        const oneHotelInfo = {
            searchTerm: req.params.searchTerm,
            id: '',
            url: '',
            name: '',
            image_url: '',
            review_count: 0,
            reviews: [],
            rating: 0,
            price: '',
            location: [],
            display_phone: '',
            watson_sentiment: [],
            keywords: [],
            emotions: []
        };
        // start populating hotel info into our object
        oneHotelInfo.id = hotel.id;
        oneHotelInfo.url = hotel.url
        oneHotelInfo.name = hotel.name;
        oneHotelInfo.image_url = hotel.image_url;
        oneHotelInfo.review_count = hotel.review_count;
        oneHotelInfo.rating = hotel.rating;
        oneHotelInfo.price = hotel.price;
        oneHotelInfo.display_phone = hotel.display_phone
        hotel.location.display_address.forEach(itemInAddress => {
            oneHotelInfo.location.push(itemInAddress);
        })
       
        // begin scrape of reviews of each hotel
        request(hotel.url, function(error, response, html) {
            // First we'll check to make sure no errors occurred when making the request
            if(!error){
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);
                
                
                var eachReview = []
                
                $('.review-content > p ').filter(function(){
                    
                    // Let's store the data we filter into a variable so we can easily see what's going on.
                    
                    var data = $(this);
                    oneHotelInfo.reviews.push(data.first().text())
                }) // end scrape 
                
                // load up our array of hotel objects with all the info we need
                hotelsInfo.push(Object.assign({},oneHotelInfo))
            }
            
        })
       
    });
    // give the scrape enough time to populate reviews, wait 3.5 seconds to load the page.
    setTimeout(function () {res.json(hotelsInfo);  }, 3700)
    
}).catch(e => {
  console.log(e);
});


});// end of yelpRoute
 


module.exports = yelpRoutes;


  
                // // IBM watson calls for natural language understanding
                // var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
                // var natural_language_understanding = new NaturalLanguageUnderstandingV1({
                //     "username": process.env.username,
                //     "password": process.env.password,
                //     'version': '2018-03-16'
                // });
                // // loop through each review to pass the text one by one into watson
                // eachReview = eachReview.splice(0,9); //only 10 reviews instead of 20
                // var i = eachReview.length
                // eachReview.forEach(oneReview => {
                //     var parameters = {
                //         'text': oneReview,
                //         'features': {
                //             'sentiment': {}
                //         }
                //     }
                    
                //         console.log(oneReview.slice(0,10));
                //         natural_language_understanding.analyze(parameters, function (err, response) {
                //             if (err)
                //             console.log('error:', err);
                //             else
                            
                //             // displays what watson feels on each review to terminal
                //             //console.log(JSON.stringify(response, null, 2));
                //             oneHotelInfo.watson_sentiment.push(response.sentiment.document.label);
                            
                //             //console.log(oneHotelInfo);
                            
                //         });
                   
                        
                //     //hotelsInfo.push(Object.assign({},oneHotelInfo));
                //     // console.log(hotelsInfo)
                //     if(i === 1){
                //         hotelsInfo.push(Object.assign({},oneHotelInfo))
                //      }
                // i--;
                // }) //end of for each