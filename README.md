# News Outlook App
+ A web application to analyse sentiment of latest news headlines.
+ Developed as part of Project #1 under General Assembly Singapore's Software Engineering Immersive Flex course.
+ Link: https://stephanieahx.github.io/news-outlook_app/

##  Built With: 
+ HTML
+ CSS - flexbox, animation
+ JavaScript - jQuery for DOM manipulation
+ AJAX call to fetch data from the API 

+ NewsAPI (www.newsapi.org)
+ AFINN-165 (json) https://github.com/fnielsen/afinn

Citation: Finn Årup Nielsen, "A new ANEW: evaluation of a word list for sentiment analysis in microblogs", Proceedings of the ESWC2011 Workshop on 'Making Sense of Microposts': Big things come in small packages. Volume 718 in CEUR Workshop Proceedings: 93-98. 2011 May. Matthew Rowe, Milan Stankovic, Aba-Sah Dadzie, Mariann Hardey (editors)

## Limitations 
AFINN as a form of sentiment analysis is rudimentary and prone to errors. 

It is not able to recognise entities or phrases and as it does not account for nuances in natural language. For instance, "Korea Exports **_Dent Optimism_** Over Global Tech Demand Recovery" is clearly negative in sentiment but would compute a positive AFINN score of 2 as the negation is not detected. 

A more sophisticated natural language processesing API would have been preferred. There are many available (e.g. Google Cloud Natural Language API, Turbo NLP API, Microsoft Azure Text Analytics). However, these require Node.js. 


## Extensions
+ sentiment tag cloud - words with font sizes varying according to frequency in latest headlines
+ sentiment words scatter diagram - with y-axis: (AFINN-score) || x-axis: frequency in latest headlines
