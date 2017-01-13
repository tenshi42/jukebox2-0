var inputDelayHandler = null;

function startSearch(pSearch) {
    initDelay(pSearch);
}

function search(pSearch){
    $.getJSON("http://yoanmercier.fr/projets/jukebox_2.0/ajax.php", {type: "search", search: pSearch}).done(function (data) {
        if(data.res.length == 0){
            var elem = $('<div class="searchResult"><div class="searchResultArtist">No results found for \'' + pSearch + '\'</div><div class="searchResultTitle">Please rephrase your search</div></div>');
            elem.click(clickResult);
            $("#searchResults").append(elem);
        }
        for(var line in data.res){
            var elem = $('<div class="searchResult" id="' + data.res[line].Id + '"><div class="searchResultArtist">' + data.res[line].Artiste + '</div><div class="searchResultTitle">' + data.res[line].Titre + '</div></div>');
            elem.click(clickResult);
            $("#searchResults").append(elem);
        }
    });
}

function initDelay(pSearch) {
    if(inputDelayHandler != null) {
        console.log("eeee");
        clearTimeout(inputDelayHandler);
    }
    if(pSearch != "") {
        inputDelayHandler = setTimeout(function () {
            search(pSearch);
        }, 500);
    }
    else
        $("#searchResults").html("");
}

function clickResult(data) {
    console.log($(this).find(".searchResultArtist").html());
}