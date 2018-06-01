const express = require("express");
const watsonRoutes = express.Router();
const axios = require("axios"); // used to call our own hotel list API

watsonRoutes.post('/:searchTerm/:price/:id', (req, res, next) => {
    console.log('watsonroute:', req.body);
    const searchTerm = req.params.searchTerm;
    const price = req.params.price
    console.log('watson',price)
    const hotelID = req.params.id;
    var myHotel = Object.assign({},req.body);
    console.log('inside route',hotelID,searchTerm)
    // declare watson NLU info
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
        "username": process.env.username,
        "password": process.env.password,
        'version': '2018-03-16'
    });
   
            // loop through reviews to pass to watson and retrieve sentiment of each.
            myHotel.reviews.forEach(oneReview => {
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
                       myHotel.watson_sentiment.push(response.sentiment.document.label);
                        
                    //console.log(oneHotelInfo);

                });

               

            }); // end of reviews forEach
            const consolidatedReview = myHotel.reviews.join(' ');
            var parameters = {
                'text': consolidatedReview,
                'features': {
                    'keywords': {},
                    'emotion': {}
                }
            }

            natural_language_understanding.analyze(parameters, function (err, response) {
                if (err)
                    console.log('error:', err);
                else

                    // displays what watson feels on each review to terminal
                    //console.log(JSON.stringify(response, null, 2));
                    myHotel.keywords = response.keywords;
                    myHotel.emotions = response.emotion.document.emotion;
                    myHotel.emotions.sadness = Math.round(myHotel.emotions.sadness * 100);
                    myHotel.emotions.joy = Math.round(myHotel.emotions.joy * 100);
                    myHotel.emotions.fear = Math.round(myHotel.emotions.fear * 100);
                    myHotel.emotions.disgust = Math.round(myHotel.emotions.disgust * 100);
                    myHotel.emotions.anger = Math.round(myHotel.emotions.anger * 100);
                    
                console.log(myHotel);

            });

        setTimeout(function () {myHotel.watson_sentiment = reviewAnalysis(myHotel.watson_sentiment)},1000)
        setTimeout(function () {res.json(myHotel);},1501)
        
       
       
 
});// end of watson route

function reviewAnalysis(reviewsToAnalyze) {
    const negativeReviews = reviewsToAnalyze.filter(negativeReview => negativeReview === "negative");
    const neutralReviews = reviewsToAnalyze.filter(neutralReview => neutralReview === "neutral");
    const negativePercentage = negativeReviews.length / reviewsToAnalyze.length;
    const neutralPercentage = neutralReviews.length / reviewsToAnalyze.length;
    const positivePercentage = (reviewsToAnalyze.length - (negativeReviews.length + neutralReviews.length)) / reviewsToAnalyze.length;
    const analysis = [Math.round(positivePercentage*100),Math.round(negativePercentage*100),Math.round(neutralPercentage*100)];
    return analysis;
}
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