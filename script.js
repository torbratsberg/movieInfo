// Listens to if enter is pressed in search field and runs searchTitles()
var searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        searchTitles();
    }
});

// Displays search results list and clears all the data from previous movie and runs getTitleId()
function searchTitles() {
    $('#searchResults').css('display', 'inline');

    $('#movieTitle, h2, h3, #moviePlot').text('');
    $('#moviePoster').attr('src', '');

    let searchInput = $('#searchInput').val();
    getTitleId(searchInput);
}

// Requests movies with the name searched from IMDb api and displays the results
function getTitleId(searchTitle) {
    let settings = {
        "url": "https://imdb-api.com/en/API/SearchTitle/k_O8Bn78pa/" + searchTitle,
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        for (let i = 0; i < response.results.length; i++) {
            // Add each movie found to the search results list with title and description
            $('#searchResults').append('<li><button onClick="getMovieData(\'' + response.results[i].id + '\')">' + response.results[i].title + ' ' + response.results[i].description + '</button></li>');
        }
    });
}

// Gets movie ID from getTitleId() and requests more info from IMDb api
function getMovieData(id) {

    window.location.href = "http://tor.bratsberg.net/movieInfo/index.html/?id=" + id;

    let settings = {
        "url": "https://imdb-api.com/en/API/Title/k_O8Bn78pa/" + id + "/FullActor,FullCast,Posters,Images,Trailer,Ratings,",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);

        // Clear search field
        $('#searchInput').val('');

        // Remove search results and empty list
        $('#searchResults').css('display', 'none');
        $('li').remove();
        $('button').remove();

        // Display data from IMDb API in DOM
        $('#movieTitle').text('| ' + response.title);
        $('#movieTagline').text(response.tagline);
        $('#movieDirectors').text('Directed by: ' + response.directors);
        $('#movieYear').text(response.year);
        $('#movieCountry').text(response.countries);
        $('#movieLength').text(response.runtimeStr);
        $('#imdbRating').text((response.imDbRating * 10) + ' / 100 on IMDb');
        $('#metacriticRating').text(response.metacriticRating + ' / 100 on Metacritic');
        $('#movieAwards').text(response.awards);
        $('#moviePlot').text(response.plot);
        $('#moviePoster').attr('src', response.image);
    });
}

function urlVar() {
    // Put URL into STR
    let str = window.location.href;

    // Define regex
    let myRegex = /[a-z]+[0-9]+/g;
    
    // Regex match movie id
    let checkURL = myRegex.test(str);
    
    // Call getMovieData() with id stored in URL
    if(checkURL == false) {
        console.log('Could not find movie ID in URL');
    } else if(checkURL == true) {
        console.log('Found movie ID in URL');

        // Find movie ID in URL
        let movieId = str.match(myRegex)[0];
    
        // Run getMovieData with the movie ID found in URL
        getMovieData(movieId);
    }
}

urlVar();