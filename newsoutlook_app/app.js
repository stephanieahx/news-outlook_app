$(() => {
    let url = 'https://newsapi.org/v2/top-headlines?' +
        'country=' + 'sg' + '&apiKey=82fe58b2a7bf409093b32e883f0dee11';
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'JSON',

        success: function (newsdata) {
        }
    });

})
