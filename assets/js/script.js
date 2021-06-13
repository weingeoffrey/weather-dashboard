// Function to load searches from localstorage
var loadSearches = function() {
    searches = JSON.parse(localStorage.getItem("searches"));

    if (!searches) {
        searches = [];
    }

    // Clear out the previous searches to ensure no duplicates are generated
    $('#previous_searches').empty();

    // Create the elements for the previous searches
    searches.forEach(function(search) {
        $('#previous_searches').append('<button class="btn btn-secondary m-1 searchbtns">' + search + '</button>')
    })
}

// Function to save searches to localstorage
var saveSearches = function() {
    localStorage.setItem("searches", JSON.stringify(searches));
}

// Function to pull weather data from OpenWeatherMap API and populate DOM elements
var getForecast = function(citySearch) {
    // Fetch the cities lat/long
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + 
        citySearch + '&units=imperial&appid=6a2c1ceff53c48a68b5e414a71aa27d0'
    )
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // Get lat/lon from the city search API to get more in depth results
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' +
            cityLat +
            '&lon=' + cityLon +
            '&exclude=minutely,hourly,alerts&units=imperial&appid=6a2c1ceff53c48a68b5e414a71aa27d0'
            )
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    // Get current weather variables
                    var currentTemp = response.current.temp;
                    var currentWind = response.current.wind_speed;
                    var currentHumidity = response.current.humidity;
                    var currentUVI = response.current.uvi;
                    var currentDate = new Date(response.current.dt * 1000).toLocaleDateString("en-US");
                    var currentIcon = response.current.weather[0].icon;
                    
                    // object containing the forecast information for the next 5 days
                    var fiveDayForecast = [
                        {
                            "date": new Date(response.daily[1].dt * 1000).toLocaleDateString("en-US"),
                            "icon": response.daily[1].weather[0].icon,
                            "temp": response.daily[1].temp.day,
                            "wind": response.daily[1].wind_speed,
                            "humidity": response.daily[1].humidity
                        },
                        {
                            "date": new Date(response.daily[2].dt * 1000).toLocaleDateString("en-US"),
                            "icon": response.daily[2].weather[0].icon,
                            "temp": response.daily[2].temp.day,
                            "wind": response.daily[2].wind_speed,
                            "humidity": response.daily[2].humidity
                        },
                        {
                            "date": new Date(response.daily[3].dt * 1000).toLocaleDateString("en-US"),
                            "icon": response.daily[3].weather[0].icon,
                            "temp": response.daily[3].temp.day,
                            "wind": response.daily[3].wind_speed,
                            "humidity": response.daily[3].humidity
                        },
                        {
                            "date": new Date(response.daily[4].dt * 1000).toLocaleDateString("en-US"),
                            "icon": response.daily[4].weather[0].icon,
                            "temp": response.daily[4].temp.day,
                            "wind": response.daily[4].wind_speed,
                            "humidity": response.daily[4].humidity
                        },
                        {
                            "date": new Date(response.daily[5].dt * 1000).toLocaleDateString("en-US"),
                            "icon": response.daily[5].weather[0].icon,
                            "temp": response.daily[5].temp.day,
                            "wind": response.daily[5].wind_speed,
                            "humidity": response.daily[5].humidity
                        },
                    ];

                    // empty out the current forecast box
                    $('#current_forecast').empty();

                    // append elements to the current forecast box
                    $('#current_forecast').append('<h2>' + citySearch + " " + currentDate + '<img src=https://openweathermap.org/img/wn/' + currentIcon + '@2x.png>' + '</h2>');
                    $('#current_forecast').append('<p>Temperature: ' + currentTemp + " ℉" + '</p>');
                    $('#current_forecast').append('<p>Wind: ' + currentWind + " MPH" + '</p>');
                    $('#current_forecast').append('<p>Humidity: ' + currentHumidity + "%" + '</p>');
                    

                    // Change background of span based off of UV index rating
                    if (currentUVI < 2) {
                        $('#current_forecast').append('<p>UV Index: <span class="bg-success text-white p-1 rounded">' + currentUVI + '</span></p>');
                    }
                    else if (currentUVI > 2 && currentUVI < 8) {
                        $('#current_forecast').append('<p>UV Index: <span class="bg-warning text-white p-1 rounded">' + currentUVI + '</span></p>');
                    }
                    else if (currentUVI > 8) {
                        $('#current_forecast').append('<p>UV Index: <span class="bg-danger text-white p-1 rounded">' + currentUVI + '</span></p>');
                    }
                    
                    // Check to see if 5-day forecast header exists, to eliminate duplicates
                    if ($('#five_day_header').length) {
                        $('#five_day_header').remove();
                        $('#five_day').prepend("<h3 id='five_day_header'>5-Day Forecast:</h3>")
                    }
                    else {
                        $('#five_day').prepend("<h3 id='five_day_header'>5-Day Forecast:</h3>")
                    }

                    // empty out the extended forecast box
                    $('#extended-forecast-parent').empty();

                    // loop through each entry in the fiveDayForecast object and create a corresponding card
                    fiveDayForecast.forEach(function(dayForecast) {
                        var weatherCard = $("<div>").attr({"class": "card text-white bg-dark m-1"});
                        var weatherCardHeader = $("<div>").attr({"class": "card-header"}).html('<h5>' + dayForecast.date + '<img src=https://openweathermap.org/img/wn/' + dayForecast.icon + '@2x.png>' + '</h5>');
                        var weatherCardBody = $("<div>").attr({"class": "card-body"});
                        var weatherCardTemp = $("<p>").attr({"class": "card-text"}).text("Temp: " + dayForecast.temp + " ℉");
                        var weatherCardWind = $("<p>").attr({"class": "card-text"}).text("Wind: " + dayForecast.wind + " MPH");
                        var weatherCardHumidity = $("<p>").attr({"class": "card-text"}).text("Humidity: " + dayForecast.humidity + "%");

                        // append the card object to the forecast parent
                        $("#extended-forecast-parent").append(weatherCard);

                        // append temp, wind and humidity to the card body
                        weatherCardBody.append(weatherCardTemp, weatherCardWind, weatherCardHumidity)

                        // append the header and body to the individual card parent
                        weatherCard.append(weatherCardHeader, weatherCardBody)
                    })
                })
        })
}

// Load initial searches from localstorage
loadSearches();

// Dynamically created buttons will work with this below
$("#previous_searches").on("click", ".searchbtns", function() {
    // Get the city to search from the button's value
    var citySearch = $(this).text();
    getForecast(citySearch);
})

// Check to see if the Submit button is pressed
$("#btnSubmit").click(function() {
    // Get the city to search for from input field
    var citySearch = $('#city_search').val();

    if (citySearch != "") {
        // Check to see if this was previously searched for
        var previousSearch = searches.includes(citySearch);

        if (!previousSearch) {
            searches.push(citySearch);
            saveSearches();
        }
        if ($('#alert').length) {
            // Remove any previous alerts
            $('#alert').remove();
        }
        getForecast(citySearch);
        loadSearches();
    }
    else {
        // Check to see if an alert already exists
        if ($('#alert').length) {
            // Remove any previous alerts
            $('#alert').remove();
            // Create new alert
            $('#searchbox').prepend('<div class="alert alert-warning" role="alert" id="alert">Please ensure you enter a City</div>');
        }
        // If no alerts already exist
        else {
            // Create new alert
            $('#searchbox').prepend('<div class="alert alert-warning" role="alert" id="alert">Please ensure you enter a City</div>');
        }
    }
})

// JQuery Media Query to adjust columns on smaller screens
$(window).resize(function(){
    if ($(window).width()<767) {
        $('#main').removeClass('row');
        $('#main').addClass('col');
        $('#searchbox').removeClass('col-3');
        $('#forecastbox').removeClass('col-9');
    };
});

// JQuery Media Query to adjust columns on larger screens
$(window).resize(function(){
    if ($(window).width()>768) {
        $('#main').removeClass('col');
        $('#main').addClass('row');
        $('#searchbox').addClass('col-3');
        $('#forecastbox').addClass('col-9');
    };
});