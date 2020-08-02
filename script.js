let searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", e => {
    if (e.keyCode === 13) {
        searchTitles();
    }
});

function searchTitles() {
    $('#searchResults').css('display', 'inline');
    $('#movieTitle, #movieTagline, h2, h3, #moviePlot').text('');
    $('#moviePoster').attr('src', '');

    getTitleId($('#searchInput').val());
}

function getTitleId(searchTitle) {
    $('#loadingSpinnerContainer').css('display', 'flex');

    let settings = {
        "url": "https://imdb-api.com/en/API/SearchTitle/k_O8Bn78pa/" + searchTitle,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(response => {
        $('#loadingSpinnerContainer').css('display', 'none');

        if (response.results == null) {
            $('#movieTitle, #movieTagline, h2, h3, #moviePlot').text('');
            $('#moviePoster').attr('src', '');
            $('#movieTitle').text('Out of API calls, come back tomorrow.');
        } else {
            let i = 0;
            response.results.forEach(() => {
                $('#searchResults').append('<li><button onClick="getMovieData(\'' + response.results[i].id + '\')">' + response.results[i].title + ' ' + response.results[i].description + '</button></li>');
                i++;
            });
        }
    });
}

function getMovieData(id) {
    $('#searchInput').val('');
    $('#loadingSpinnerContainer').css('display', 'flex');
    $('#searchResults').css('display', 'none');
    $('li').remove();
    $('button').remove();

    history.pushState({}, '', '?id=' + id);

    let settings = {
        "url": "https://imdb-api.com/en/API/Title/k_O8Bn78pa/" + id + "/FullActor,FullCast,Posters,Images,Trailer,Ratings,",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(response => {
        if (response.title == null) {
            $('#movieTitle, #movieTagline, h2, h3, #moviePlot').text('');
            $('#moviePoster').attr('src', '');
            $('#movieTitle').text('Something went wrong, try another movie');
        } else {
            displayInfo(response);
        }
    });
}


function urlVar() {
    let regex = /[a-z]+[0-9]+/g;
    let checkURL = regex.test(window.location.href);
    
    if (checkURL == true) {
        let movieId = url.match(regex)[0];
        getMovieData(movieId);
    }
}

function displayInfo(response) {
    console.log(response);
    $('#loadingSpinnerContainer').css('display', 'none');
    $('#movieTitle').text('| ' + response.title);
    $('#movieTagline').text(response.tagline);
    $('#movieDirectors').text('Directed by: ' + response.directors);
    $('#movieYear').text(response.year);
    $('#movieCountry').text(response.countries);
    $('#movieLength').text(response.runtimeStr);
    $('#imdbRating').text((response.imDbRating * 10) + ' / 100 on IMDb');
    if (response.metacriticRating != "") {
        $('#metacriticRating').text(response.metacriticRating + ' / 100 on Metacritic');
    } else if (response.metacriticRating == "") {
        $('#metacriticRating').text('');
    }
    $('#movieAwards').text(response.awards);
    $('#moviePlot').text(response.plot);
    $('#moviePoster').attr('src', response.image);
}

urlVar();