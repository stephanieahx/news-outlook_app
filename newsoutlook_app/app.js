$(() => {
    //-- UI -- 

    //STICKY NAV
    $(window).on('scroll', function () {
        if ($(window).scrollTop()) {
            $('nav').addClass('black');
        }
        else {
            $('nav').removeClass('black');
        }
    })
    //DROPDOWN MENU CLOSES WHEN SCROLLING
    $(window).on('scroll', function () {
        $('nav button').removeClass('show');
    })
    //SHOW IMAGE BUTTON
    $('.img-icon').on('click', function () {
        $('img').toggleClass('show');
    })
    //MENU TOGGLE BUTTON
    $('.menu-icon').on('click', function () {
        $('nav button').toggleClass('show');
    });
    //LOGO REFRESH PAGE BUTTON 
    $('.logo').on('click', function (e) {
        e.preventDefault();
        location.reload();
    })


    //-- SENTIMENT ANALYIS -- 

    //GET AFINN OBJECT FROM CDN
    let afinn = {};
    jQuery.when(
        $.getJSON('https://cdn.jsdelivr.net/npm/afinn-111@1.1.4/index.json')).done(function (json) {
            afinn = json;
        });

    //CREATES AN ARRAY OF LOWERCASE WORDS FROM A STRING
    function makeWordArray(headline) {
        let wordArray = headline.toLowerCase().split(/\W/);
        return wordArray;
    }

    //CALCULATES SENTIMENT BY COMPARING EACH WORD WITH AFINN OBJECT
    function calculateSentimentScore(wordArray) {
        let score = 0;
        for (let wordscoreIndex = 0; wordscoreIndex < wordArray.length; wordscoreIndex++) {
            if (afinn[wordArray[wordscoreIndex]]) {
                score += afinn[wordArray[wordscoreIndex]];
                // let $wordScore = wordArray[i] + ': ' + afinn[wordArray[i]];
                // let word = wordArray[i];
                // console.log($wordScore);
                // $('.word-cloud').append(' ' + word);
            }
        }
        return score;
    }

    //CREATES WORD CLOUD OF SENTIMENT WORDS - not working 'Uncaught TypeError: headlineArray is not a function'
    let sentimentArray = [];
    function createSentimentWordCloud(headlineArray) {
        let sentimentWordArray = [];
        for (let wordIndex = 0; wordIndex < headlineArray.length; wordIndex++) {
            if (afinn[headlineArray(wordIndex)]) {
            console.log(headlineArray(wordIndex));
                let sentimentWord = headlineArray[wordIndex];
                console.log(sentimentWord);
                $('.word-cloud').append(sentimentWordArray);
                sentimentWordArray.push(sentimentWord);
            }
        }
        let sortedArray = sentimentWordArray.sort();
        consolelog(sortedArray);
        return sortedArray;
    }

    //CALCULATING THE SENTIMENT SCORE OF HEADLINES FROM EACH COUNTRY
    const countryArray = ['my', 'sg', 'gb', 'us']
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
                let score = calculateSentimentScore(headlineWordArray);
                let scoreData = `
                <td>${score}</td>`
                $('.sentimentScores').append(scoreData);
                console.log(headlineWordArray);
                createSentimentWordCloud(headlineWordArray);
            }
        })
    }

    // -- NEWS CARDS -- 

    //FUNCTION TO REMOVE PUBLISHER FROM HEADLINE AS PUBLISHER'S NAME MAY CORRUPT THE SENTIMENT SCORE CALCULATED. E.G. '- THE STAR' COMPUTES A SENTIMENT SCORE OF 
    // function removePublisher(title) {
    //     headline = title.replace(' - The Straits Times', '').replace(' - CNA', '').replace(' - Today', '').replace(' - The Star Online', '').replace(' - Free Malaysia Today', '')
    //     return headline;
    // }

    //CREATES CARDS OF NEWS HEADLINES WHEN COUNTRY-BUTTON IS CLICKED
    $('button').on('click', function () {
        $('.card-deck').empty();
        let country = $(event.currentTarget).attr('id');
        let url = 'https://newsapi.org/v2/top-headlines?' + 'country=' + country + '&apiKey=82fe58b2a7bf409093b32e883f0dee11';
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
            }
        });
    })

    //WHEN YOU HOVER OVER A CARD IT IS RED OR GREEN ACCORDING TO IT'S SENTIMENT SCORE
    //FUNCTION MAKE BACKGROUND GREEN - NOT WORKING 
    // $('card').hover(function () {
    //     if (parseInt($('.card').attr('id')) < 0) {
    //         console.log($('.card').attr('id'));
    //         console.log(parseInt($('.card').attr('id')));
    //         $(this).css('background-color', 'red');
    //     } else {
    //         $(this).css('background-color', 'green')
    //     }
    // })
    //TOOLTIP TO DISPLAY SENTIMENT SCORE OF HEADLINE - bootstrap not working well
    $( function() {
        $( document ).tooltip();
      } );
})
