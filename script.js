// Listens to if enter is pressed in search field and runs searchTitles()
var searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        searchTitles();
    }
});

// Displays search results list and clears all the data from previous movie and runs getTitleId()
function searchTitles() {
    //Show results section
    $('#searchResults').css('display', 'inline');

    // Remove earlier movie info
    $('#movieTitle, #movieTagline, h2, h3, #moviePlot').text('');
    $('#moviePoster').attr('src', '');

    // Get movie name from search bar and run getTitleId()
    let searchInput = $('#searchInput').val();
    getTitleId(searchInput);
}

// Requests movies with the name searched from IMDb api and displays the results
function getTitleId(searchTitle) {
    $('#loadingSpinnerContainer').css('display', 'flex');

    let settings = {
        "url": "https://imdb-api.com/en/API/SearchTitle/k_O8Bn78pa/" + searchTitle,
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        $('#loadingSpinnerContainer').css('display', 'none');
        
        for (let i = 0; i < response.results.length; i++) {
            // Add each movie found to the search results list with title and description
            $('#searchResults').append('<li><button onClick="getMovieData(\'' + response.results[i].id + '\')">' + response.results[i].title + ' ' + response.results[i].description + '</button></li>');
        }
    });
}

// Gets movie ID from getTitleId() and requests more info from IMDb api
function getMovieData(id) {
    // Clear search field
    $('#searchInput').val('');

    $('#loadingSpinnerContainer').css('display', 'flex');

    // Remove search results and empty list
    $('#searchResults').css('display', 'none');
    $('li').remove();
    $('button').remove();
    
    // Put movie ID in URL
    history.pushState({}, '', '?id=' + id);
    
    let settings = {
        "url": "https://imdb-api.com/en/API/Title/k_O8Bn78pa/" + id + "/FullActor,FullCast,Posters,Images,Trailer,Ratings,",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        // In case IMDb API returns 'null'
        if (response.title == null) {
            // Remove earlier movie info
            $('#movieTitle, #movieTagline, h2, h3, #moviePlot').text('');
            $('#moviePoster').attr('src', '');
            
            $('#movieTitle').text('Something went wrong, try another movie' );
            
        } else {
            displayInfo(response);
        }
    });
}


function urlVar() {
    let url = window.location.href;
    let regex = /[a-z]+[0-9]+/g;
    
    // Check if there is a variable in URL
    let checkURL = regex.test(url);
    
    // Call getMovieData() with id stored in URL
    if(checkURL == true) {
        // Find movie ID in URL
        let movieId = url.match(regex)[0];
        
        // Run getMovieData with the movie ID found in URL
        getMovieData(movieId);
    }
}

function displayInfo(response) {
    $('#loadingSpinnerContainer').css('display', 'none');
    
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
}

urlVar();