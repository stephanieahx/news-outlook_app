$(() => {
    //-- UI -- 
    //INFO MODAL
    $('.info-icon').on('click', function (e) {
        $('#modal').css('display', 'block');
    })
    $('.closeModal').on('click', function (e) {
        $('#modal').css('display', 'none');
    })
    //LOGO REFRESH PAGE BUTTON 
    $('.logo').on('click', function (e) {
        e.preventDefault();
        location.reload();
    })
    //STICKY NAV
    $(window).on('scroll', function () {
        if ($(window).scrollTop()) {
            $('nav').addClass('black');
        }
        else {
            $('nav').removeClass('black');
        }
    })
    //SHOW IMAGE BUTTON
    $('.img-icon').on('click', function () {
        $('img').toggleClass('show');
    })
    //MENU TOGGLE BUTTON
    $('.menu-icon').on('click', function () {
        $('nav button').toggleClass('show');
    });
    //DROPDOWN MENU CLOSES WHEN SCROLLING
    $(window).on('scroll', function () {
        $('nav button').removeClass('show');
    })

    //-- ANCILLARY FUNCTIONS -- 
    //GET TIME AND DATE OF LATEST UPDATE
    function displayUpdateTime() {
        $('.update-time').empty();
        let UpdateTime = new Date();
        let updatetimeData = `<p>UPDATED: ${UpdateTime}</p>`
        $('.update-time').append(updatetimeData);
    }

    //-- SENTIMENT ANALYIS -- 

    //GET AFINN OBJECT FROM CDN
    let afinn = {};
    jQuery.when(
        $.getJSON('https://cdn.jsdelivr.net/npm/afinn-165@1.0.4/index.json')).done(function (json) {
            afinn = json;
        });

    //CREATES AN ARRAY OF LOWERCASE WORDS FROM A STRING
    function makeWordArray(headline) {
        let wordArray = headline.toLowerCase().split(/\W/);
        return wordArray;
    }

    // //EMOTICON ACCORDING TO SENTIMENT SCORE  
    function determineScoreEmoticon(score) {
        if (score > 10) {
            scoreEmoticon = '<i class=\"far fa-laugh-wink\"></i>'
        } else if (score <= 10 && score > 5) {
            scoreEmoticon = '<i class=\"far fa-smile\"></i>';
        } else if (score > 0 && score <= 5) {
            scoreEmoticon = '<i class=\"far fa-meh\"></i>';
        } else if (score <= 0 && score > -5) {
            scoreEmoticon = '<i class=\"far fa-frown\"></i>';
        } else if (score <= -5 && score > -10) {
            scoreEmoticon = '<i class=\"far fa-sad-tear\"></i>';
        } else if (score <= -10) {
            scoreEmoticon = '<i class=\"far fa-sad-cry\"></i>'
        }
        return scoreEmoticon;
    }

    //CALCULATES SENTIMENT BY COMPARING EACH WORD WITH AFINN OBJECT
    function calculateSentimentScore(wordArray) {
        let score = 0;
        for (let wordscoreIndex = 0; wordscoreIndex < wordArray.length; wordscoreIndex++) {
            if (afinn[wordArray[wordscoreIndex]]) {
                score += afinn[wordArray[wordscoreIndex]];
            }
        }
        return score;
    }

    //COLOUR ACCORDING TO INTEGER - POSITIVE (GREEN) OR NEGATIVE (RED) SCORE
    function scoreColor(score) {
        if (score < 0) {
            color = 'rgba(178,49,64, 0.7)';
        } else {
            color = 'rgba(49,178,99, 0.7)';
        }
        return color;
    }

    //CREATES AN OBJECT OF SENTIMENT WORDS WITH THEIR AFINN SCORE AND THEIR FREQUENCY IN HEADLINES THEN CREATES A TABLE TO DISPLAY THIS DATA
    function createPrevailingSentimentObject(array) {
        let prevailingSentimentObject = {};
        let sortedArray = array.sort();
        // console.log(sortedArray)
        for (wordIndex = 0; wordIndex < sortedArray.length; wordIndex++) {
            let subsequentIndex = wordIndex + 1;
            if (sortedArray[wordIndex] === sortedArray[subsequentIndex]) {
                let originalIndex = wordIndex;
                wordIndex = subsequentIndex;
                subsequentIndex++;
                prevailingSentimentObject[(sortedArray[wordIndex])] = {
                    word: (sortedArray[wordIndex]),
                    frequency: subsequentIndex - originalIndex,
                    score: afinn[sortedArray[wordIndex]],
                }
                let rowColor = scoreColor(prevailingSentimentObject[sortedArray[wordIndex]].score);
                let wordData = `
                <tr style='background-color:${rowColor}'>
                    <td>"${prevailingSentimentObject[sortedArray[wordIndex]].word}"</td>
                    <td>${prevailingSentimentObject[sortedArray[wordIndex]].score}</td>
                    <td>${prevailingSentimentObject[sortedArray[wordIndex]].frequency}</td>
                </tr>
                `
                $('.sentimentWordsFrequency').append(wordData);


            } else {
                prevailingSentimentObject[(sortedArray[wordIndex])] = {
                    word: (sortedArray[wordIndex]),
                    frequency: 1,
                    score: afinn[sortedArray[wordIndex]],
                }
                let rowColor = scoreColor(prevailingSentimentObject[sortedArray[wordIndex]].score);
                let wordData = `
                <tr style='background-color:${rowColor}'>
                    <td>"${prevailingSentimentObject[sortedArray[wordIndex]].word}"</td>
                    <td>${prevailingSentimentObject[sortedArray[wordIndex]].score}</td>
                    <td>${prevailingSentimentObject[sortedArray[wordIndex]].frequency}</td>
                </tr>
                `
                $('.sentimentWordsFrequency').append(wordData);
            }
        }
        return prevailingSentimentObject;
    }

    //CREATE WORD ARRAY OF SENTIMENT WORDS IN HEADLINES 
    function createSentimentWordArray(headlineWordArray) {
        let sentimentWordArray = [];
        for (let wordIndex = 0; wordIndex < headlineWordArray.length; wordIndex++) {
            if (afinn[headlineWordArray[wordIndex]]) {
                // console.log(headlineWordArray[wordIndex]);
                sentimentWordArray.push(headlineWordArray[wordIndex]);
            }
        }
        // console.log(sentimentWordArray);
        return (sentimentWordArray)
    }

    //OUTLOOK TABLE FOR SENTIMENT ANALYSIS 
    const countryArray = ['my', 'sg', 'gb', 'us'];
    for (countryIndex = 0; countryIndex < countryArray.length; countryIndex++) {
        let countryUrl = 'https://newsapi.org/v2/top-headlines?' + 'country=' + countryArray[countryIndex] + '&apiKey=82fe58b2a7bf409093b32e883f0dee11'
        $.ajax({
            url: countryUrl,
            method: 'GET',
            dataType: 'JSON',
            success: function (newsdata) {
                let stringOfHeadlines = '';
                let articlesObject = newsdata.articles;
                for (let articleIndex = 0; articleIndex < articlesObject.length; articleIndex++) {
                    let headline = articlesObject[articleIndex].title;
                    stringOfHeadlines += ' ' + headline;
                }
                let headlineWordArray = makeWordArray(stringOfHeadlines);
                //CALCULATES AGGREGATE SCORE OF ALL HEADLINES 
                let score = calculateSentimentScore(headlineWordArray);
                let scoreEmoticon = determineScoreEmoticon(score);
                let scoreData = `
                <td title='Aggregate Sentiment Score: ${score}'>${scoreEmoticon}</td>`
                $('.sentimentScores').append(scoreData);
                //SENTIMENT WORD ARRAY 
                let countrySentimentWordArray = createSentimentWordArray(headlineWordArray);
                //A COUNTRY'S PREVAILING SENTIMENT ANALYSIS - CREATES A TABLE TO LIST SENTIMENT WORDS WITH ITS AFINN-SCORE AND FREQUENCY IN CURRENT HEADLINES
                createPrevailingSentimentObject(countrySentimentWordArray);
                //DISPLAYS TIME OF LATEST UPDATE
                displayUpdateTime();
            }
        })
    }


    // -- NEWS CARDS -- 

    //CREATES CARDS OF NEWS HEADLINES WHEN COUNTRY-BUTTON IS CLICKED
    $('button').on('click', function () {
        //HIDES OVERVIEW
        $('div.overview').attr('class', 'overview-hide');
        //EMPTIES CARD DECK
        $('.card-deck').empty();
        //CLEARS UPDATE TIME
        $('update-time').empty();
        //CLEAR PAGE TITLE
        $('.page-title').empty();
        //CREATING PAGE TITLE
        let countryName = $(event.currentTarget).html();
        let title = `
        <h1>The Latest News Headlines in ${countryName}</h1>`;
        $('.page-title').append(title);
        //CREATING API URL FOR SPECIFIC COUNTRY
        let country = $(event.currentTarget).attr('id');
        let url = 'https://newsapi.org/v2/top-headlines?' + 'country=' + country + '&apiKey=82fe58b2a7bf409093b32e883f0dee11';
        //AJAX CALL
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'JSON',
            success: function (newsdata) {
                let articlesObject = newsdata.articles;
                let headline;
                let articleLink;
                let articleImg;
                for (let i = 0; i < articlesObject.length; i++) {
                    headline = articlesObject[i].title;
                    articleLink = articlesObject[i].url;
                    articleImg = articlesObject[i].urlToImage;
                    let headlineSentimentScore = calculateSentimentScore(makeWordArray(headline));
                    let newsCards = '';
                    newsCards += `
                    <div class='card' title='Sentiment Score: ${headlineSentimentScore}'> 
                    <img src='${articleImg}'>
                    <a href='${articleLink}'><p class='headline'>${headline}</p></h5>
                    </div>
                    `;
                    $(".card-deck").append(newsCards);
                    // console.log(makeWordArray(headline));
                }
            },
            complete: function () {
                displayUpdateTime();
            },
            error: function () {
                alert('Error.');
            },

        });

    })

    //TOOL TIP FOR EACH CARD SHOWING THE HEADLINE'S SENTIMENT SCORE
    $().tooltip();

})
