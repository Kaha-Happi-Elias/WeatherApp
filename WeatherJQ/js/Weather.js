var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    cKey: 'NHNTVDc4UjhKY1FsNjZBcDZ3NDF1bm9mODJrNnQ1R1NTQ2IwYWl2ZA=='
};

const $countrySelect = $('.country');
const $stateSelect = $('.state');
const $citySelect = $('.city');
const $cityForm = $('#city-form');
const $reportSection = $('#weather-report'); 


const $loadingIndicator = $('<div class="spinner-border position-absolute top-50 start-50"></div>')
    .css({ "width": "3rem", "height": "3rem" })
    .hide()
    .appendTo('body');
/*OR const $loaderIndicator = $('<div id="#loader"></div>').hide().appendTo('body'); */

function showLoading() {
    $loadingIndicator.show();
}

function hideLoading() {
    $loadingIndicator.hide();
}

function loadCountries(){
    $.ajax({
        url: config.cUrl,
        headers: { "X-CSCAPI-KEY": config.cKey },
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $countrySelect.html('<option value="">Select Country</option>');
            $.each(data, function(index, country) {
                $countrySelect.append($('<option class="bg-dark-subtle"></option>').val(country.iso2).text(country.name));
            });
        },
        error: function(error) {
            console.error('Error loading countries:', error);
        }
    });
    $stateSelect.prop('disabled', true).css('pointer-events', 'none');
    $citySelect.prop('disabled', true).css('pointer-events', 'none');
}

function loadStates(){
    showLoading();
    $stateSelect.prop('disabled', false).css('pointer-events', 'auto');
    $citySelect.prop('disabled', true).css('pointer-events', 'none');

    const selectedCountryCode = $countrySelect.val();
    $stateSelect.html('<option value="">Select State</option>');
    $.ajax({
        url: `${config.cUrl}/${selectedCountryCode}/states`, // Corrected URL construction
        headers: { "X-CSCAPI-KEY": config.cKey },
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $.each(data, function(index, state) {
                $stateSelect.append($('<option class="bg-dark-subtle"></option>').val(state.iso2).text(state.name));
            });
            hideLoading();
        },
        error: function(error) {
            console.error('Error loading states:', error);
            hideLoading();
        }
    });
}

function loadCities(){
    showLoading();
    $citySelect.prop('disabled', false).css('pointer-events', 'auto');
    const selectedCountryCode = $countrySelect.val();
    const selectedStateCode = $stateSelect.val();
    $citySelect.html('<option value="">Select City</option>');
    $.ajax({
        url: `${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, // Corrected URL construction
        headers: { "X-CSCAPI-KEY": config.cKey },
        type: 'GET',
        dataType: 'json',
        success: function(data){
            $.each(data, function(index, city){
                $citySelect.append($('<option class="bg-dark-subtle"></option>').val(city.name).text(city.name));
            });
            hideLoading();
        },
        error: function(error) {
            console.error('Error loading cities:', error);
            hideLoading();
        }
    });
}

$(document).ready(function() {
    loadCountries();
    $countrySelect.change(loadStates);
    $stateSelect.change(loadCities);
});

//Weather API section:
$cityForm.submit(function(event){
    event.preventDefault();
    const chosenCity = $citySelect.val(); // Use jQuery selector here
    showLoading();

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${chosenCity}&appid=b34fddd3dae4a2eb0ad363b62f98ba1e&units=metric`,
        type: 'GET',
        dataType: 'json',
        success: function(weatherData) {
            $reportSection.html(`The weather in ${weatherData.name} is ${weatherData.weather[0].main} with a temperature of ${weatherData.main.temp}°C.`);
        },
        error: function(error) {
            if (error.status === 404) {
                $reportSection.text('City not found!');
            } else {
                $reportSection.text(`Error fetching weather data: ${error.responseText}`);
                console.error("Weather API Error:", error);
            }
        },
        complete: function() {
            hideLoading();
        }
    });
});
