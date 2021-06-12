

// JQuery Media Query to adjust columns on smaller screens
$(window).resize(function(){
    if ($(window).width()<767) {
        console.log("hey screen is smaller than 767. cool")
        $('#main').removeClass('row');
        $('#main').addClass('col');
        $('#searchbox').removeClass('col-3');
        $('#forecastbox').removeClass('col-9');
    };
});

// JQuery Media Query to adjust columns on larger screens
$(window).resize(function(){
    if ($(window).width()>768) {
        console.log("hey screen is bigger than 768. neat")
        $('#main').removeClass('col');
        $('#main').addClass('row');
        $('#searchbox').addClass('col-3');
        $('#forecastbox').addClass('col-9');
    };
});