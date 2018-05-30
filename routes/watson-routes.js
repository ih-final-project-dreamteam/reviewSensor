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
            const consolidatedReview = myHotel[0].reviews.join(' ');
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
                    // displays what watson feels on each review to terminal
                    //console.log(JSON.stringify(response, null, 2));
                    myHotel[0].keywords = response.keywords;
                    myHotel[0].emotions = response.emotion.document.emotion;
                    myHotel[0].emotions.sadness = Math.round(myHotel[0].emotions.sadness * 100);
                    myHotel[0].emotions.joy = Math.round(myHotel[0].emotions.joy * 100);
                    myHotel[0].emotions.fear = Math.round(myHotel[0].emotions.fear * 100);
                    myHotel[0].emotions.disgust = Math.round(myHotel[0].emotions.disgust * 100);
                    myHotel[0].emotions.anger = Math.round(myHotel[0].emotions.anger * 100);
                    console.log(myHotel[0].emotions);
                    
                //console.log(oneHotelInfo);

            });

        } // end of checking ID
        setTimeout(function () {myHotel[0].watson_sentiment = reviewAnalysis(myHotel[0].watson_sentiment)},1500)
        setTimeout(function () {res.json(myHotel);},1600)
        }) // end of axios
       
       
 
});// end of watson route

function reviewAnalysis(reviewsToAnalyze) {
    const negativeReviews = reviewsToAnalyze.filter(negativeReview => negativeReview === "negative");
    const neutralReviews = reviewsToAnalyze.filter(neutralReview => neutralReview === "neutral");
    const negativePercentage = negativeReviews.length / reviewsToAnalyze.length;
    const neutralPercentage = neutralReviews.length / reviewsToAnalyze.length;
    const positivePercentage = (reviewsToAnalyze.length - (negativeReviews.length + neutralReviews.length)) / reviewsToAnalyze.length;
    const analysis = [Math.round(positivePercentage*100) ,Math.round(negativePercentage*100),Math.round(neutralPercentage*100)];
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