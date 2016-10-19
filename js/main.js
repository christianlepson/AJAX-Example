'use strict';
var $searchForm = $('#searchForm');
var $searchBox = $('#searchbox');

$searchForm.submit(function(e) {
    e.preventDefault();

    var artistSearchQuery = $(this).serialize();
    var artistSearchURL = "https://api.spotify.com/v1/search?" + artistSearchQuery + "&type=artist";

    var artistSearchError = function() {
            $('#gallery').html('<h2 class="headline--secondary">Please try again with a valid artist.</h2>');
        };
    var artistSearchSuccess = function(results) {
            if (results.artists.items.length > 0) {
                var artistID = results.artists.items[0].id;
                var artistName = results.artists.items[0].name;
                var albumSearchURL = 'https://api.spotify.com/v1/artists/' + artistID + '/albums';
                var albumSearchError = function() {
                    $('#gallery').html('<h2 class="headline--secondary">Error fetching albums.</h2>');
                };
                var albumSearchSuccess = function(result) {
                    var displayedAlbums = [];
                    var galleryHTML = '<h2 class="headline--secondary gallery__name">' + artistName + '</h2>';
                    for (var i = 0; i < result.items.length; i+=1) {
                        var albumImageURL = result.items[i].images[0].url;
                        var albumName = result.items[i].name;
                        var albumURL = result.items[i].external_urls.spotify;
                        // Avoid duplicate albums
                        if (!displayedAlbums.includes(albumName)) {
                            galleryHTML += '<div class="gallery__cell">' +
                                '<a class="gallery__link" href="' + albumImageURL + '"' +
                                    ' data-lightbox="gallery"'  + ' data-title="' + albumName + '">' +
                                '<img class="gallery__img" src="' + albumImageURL + '" alt=""/>' +
                                '<span class="gallery__desc">' + albumName + '</span>' +
                                '</a>' +
                                '</div>';
                        }
                        displayedAlbums.push(result.items[i].name);
                    }
                    $('#gallery').html(galleryHTML);
                };
                $.ajax(albumSearchURL, {
                    type: 'GET',
                    dataType: 'JSON',
                    error: albumSearchError,
                    success: albumSearchSuccess
                });

            } else {
                $('#gallery').html('<h2 class="headline--secondary">No results found for ' + $searchBox.val() + '.</h2>');
            }
    };

    $.ajax(artistSearchURL, {
        type: 'GET',
        dataType: 'JSON',
        error: artistSearchError,
        success: artistSearchSuccess
    });


});