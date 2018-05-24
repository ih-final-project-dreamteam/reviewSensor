const express = require("express");
const watsonRoutes = express.Router();
const axios = require("axios"); // used to call our own hotel list API

watsonRoutes.get('/:searchTerm/:id', (req, res, next) => {
    searchTerm = req.params.searchTerm;
    hotelID = req.params.id;
    var myHotel = [];
    console.log('inside route',hotelID,searchTerm)
    // declare watson NLU info
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
        "username": process.env.username,
        "password": process.env.password,
        'version': '2018-03-16'
    });
    // make an axios get to our api
    axios.get(`http://localhost:3000/yelp/${searchTerm}`)
        .then(eachHotel => {
            // check ID for the one clicked
            myHotel = eachHotel.data.filter(oneHotel => oneHotel.id === hotelID)
            if (myHotel){
            // loop through reviews to pass to watson and retrieve sentiment of each.
            myHotel[0].reviews.forEach(oneReview => {
                var parameters = {
                    'text': oneReview,
                    'features': {
                        'sentiment': {}
                    }
                }

                natural_language_understanding.analyze(parameters, function (err, response) {
                    if (err)
                        console.log('error:', err);
                    else

                        // displays what watson feels on each review to terminal
                        //console.log(JSON.stringify(response, null, 2));
                        myHotel[0].watson_sentiment.push(response.sentiment.document.label);
                        
                    //console.log(oneHotelInfo);

                });

               

            }); // end of reviews forEach
        } // end of checking ID
        setTimeout(function () {res.json(myHotel);},1000)
        }) // end of axios
        
 
});// end of watson route

module.exports = watsonRoutes;

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