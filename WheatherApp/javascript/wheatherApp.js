/*/const { response } = require("express");
var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries', //api url for country state city
    cKey: 'NHNTVDc4UjhKY1FsNjZBcDZ3NDF1bm9mODJrNnQ1R1NTQ2IwYWl2ZA=='  //the api key
}

var countrySelect = document.querySelector('.country'),
    stateSelect = document.querySelector('.state'),
    citySelect = document.querySelector('.city');

function loadCountries() {
    let apiEndPoint = config.cUrl;

    fetch(apiEndPoint, {headers: {"X-CSCAPI-KEY": config.cKey}})
    .then(Response => Response.json())
    .then(data => {
        //console.log(data);

        data.forEach(country => {
            const option = document.createElement('option')
            option.value = country.iso2
            option.textContent = country.name
            countrySelect.appendChild(option)
        });
    }) 
    .catch(error => console.error('Error loading countries:', error))

    stateSelect.disabled = true
    citySelect.disabled = true
    stateSelect.style.pointerEvents = 'none'
    citySelect.style.pointerEvents = 'none'
}

function loadStates() {
    stateSelect.disabled = false
    citySelect.disabled = true
    stateSelect.style.pointerEvents = 'auto'
    citySelect.style.pointerEvents = 'none'

    const selectedCountryCode = countrySelect.value
    //console.log(selectedCountryCode);
    stateSelect.innerHTML = '<option value="">Select State</option>'//To clear the existing states

    fetch(`${config.cUrl}/${selectedCountryCode}/states`, {headers: {"X-CSCAPI-KEY": config.cKey}})
    .then(Response => Response.json())
    .then(data => {
        //console.log(data);

        data.forEach(state => {
            const option = document.createElement('option')
            option.value = state.iso2
            option.textContent = state.name
            stateSelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading states:', error))
}

function loadCities() {
    citySelect.disabled = false
    citySelect.style.pointerEvents = 'auto'

    const selectedCountryCode = countrySelect.value
    const selectedStateCode = stateSelect.value
    //console.log(selectedCountryCode, selectedStateCode);
    citySelect.innerHTML = '<option value="">Select City</option>'//To clear the existing option

   fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, {headers: {"X-CSCAPI-KEY": config.cKey}})
    .then(Response => Response.json())
    .then(data => {
        //console.log(data);

        data.forEach(city => {
            const option = document.createElement('option')
            option.value = city.iso2
            option.textContent = city.name
            citySelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading cities:', error))
}

// https://api.countrystatecity.in/v1/countries/[ciso]/states/[siso]/cities
window.onload = loadCountries

const reportSection = document.getElementById('weather-report');
const cityForm = document.getElementById('city-form');
//const cityInput = document.getElementById('city');
//the object that will do all of our request work: an XMLHttpRequest
let apiRequest = new XMLHttpRequest();
apiRequest.onreadystatechange = () => {
    if (apiRequest.readyState === 4) {
        if(apiRequest.status === 404 ){
            reportSection.textContent = 'City not found!';
        }
        const response = JSON.parse(apiRequest.response);
        reportSection.textContent = `The weather in ${weatherData.name} is ${weatherData.weather[0].main} with a temperature of ${weatherData.main.temp}°C.`;
    }
};

cityForm.addEventListener('submit', ($event) =>{
    //$event.preventDefault();
    //const chosenCity = cityInput.value;
    const chosenCity = citySelect.value;
    apiRequest.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&APPID=b34fddd3dae4a2eb0ad363b62f98ba1e');
    apiRequest.send();
});*/

/*var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    cKey: 'NHNTVDc4UjhKY1FsNjZBcDZ3NDF1bm9mODJrNnQ1R1NTQ2IwYWl2ZA=='
};

var countrySelect = document.querySelector('.country'),
    stateSelect = document.querySelector('.state'),
    citySelect = document.querySelector('.city');

function loadCountries() {
    fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.cKey } })
        .then(Response => Response.json())
        .then(data => {
            countrySelect.innerHTML = '<option value="">Select Country</option>'; // Add default option
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.iso2;
                option.textContent = country.name;
                countrySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading countries:', error));

    stateSelect.disabled = true;
    citySelect.disabled = true;
    stateSelect.style.pointerEvents = 'none';
    citySelect.style.pointerEvents = 'none';
}

function loadStates() {
    stateSelect.disabled = false;
    citySelect.disabled = true;
    stateSelect.style.pointerEvents = 'auto';
    citySelect.style.pointerEvents = 'none';

    const selectedCountryCode = countrySelect.value;
    stateSelect.innerHTML = '<option value="">Select State</option>';

    fetch(`${config.cUrl}/${selectedCountryCode}/states`, { headers: { "X-CSCAPI-KEY": config.cKey } })
        .then(Response => Response.json())
        .then(data => {
            data.forEach(state => {
                const option = document.createElement('option');
                option.value = state.iso2;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
            loadingIndicator.style.display = 'flex';
        })
        .catch(error => console.error('Error loading states:', error));
}

function loadCities() {
    citySelect.disabled = false;
    citySelect.style.pointerEvents = 'auto';

    const selectedCountryCode = countrySelect.value;
    const selectedStateCode = stateSelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';

    fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, { headers: { "X-CSCAPI-KEY": config.cKey } })
        .then(Response => Response.json())
        .then(data => {
            data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name; // Use city name as value
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading cities:', error));  
}

//loadingIndicator.style.display = 'flex';
window.onload = loadCountries;

countrySelect.addEventListener('change', loadStates);
stateSelect.addEventListener('change', loadCities);

const reportSection = document.getElementById('weather-report');
const cityForm = document.getElementById('city-form');
const loadingIndicator = document.createElement('div'); // Create a loading indicator element

loadingIndicator.id = 'loader';
//loadingIndicator.textContent = 'Loading...';
loadingIndicator.style.display = 'none'; // Initially hidden
reportSection.appendChild(loadingIndicator); */// Add it to the report section


var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    cKey: 'NHNTVDc4UjhKY1FsNjZBcDZ3NDF1bm9mODJrNnQ1R1NTQ2IwYWl2ZA=='
};

var countrySelect = document.querySelector('.country'),
    stateSelect = document.querySelector('.state'),
    citySelect = document.querySelector('.city');

const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loader';
loadingIndicator.style.display = 'none';
//loadingIndicator.style.position = 'fixed';
/*loadingIndicator.style.top = '0';
loadingIndicator.style.left = '0';
loadingIndicator.style.width = '100%';
loadingIndicator.style.height = '100%';
loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.5)';*/
//loadingIndicator.style.zIndex = '1000';
//loadingIndicator.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"> </div>';  // Spinner
document.body.appendChild(loadingIndicator);

function showLoading() {
  loadingIndicator.style.display = 'flex';
}

function hideLoading() {
  loadingIndicator.style.display = 'none';
}


function loadCountries() {
    fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.cKey } })
        .then(Response => Response.json())
        .then(data => {
            countrySelect.innerHTML = '<option value="">Select Country</option>';
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.iso2;
                option.textContent = country.name;
                countrySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading countries:', error));

    stateSelect.disabled = true;
    citySelect.disabled = true;
    stateSelect.style.pointerEvents = 'none';
    citySelect.style.pointerEvents = 'none';
}

function loadStates() {
    showLoading();
    stateSelect.disabled = false;
    citySelect.disabled = true;
    stateSelect.style.pointerEvents = 'auto';
    citySelect.style.pointerEvents = 'none';

    const selectedCountryCode = countrySelect.value;
    stateSelect.innerHTML = '<option value="">Select State</option>';

    fetch(`${config.cUrl}/${selectedCountryCode}/states`, { headers: { "X-CSCAPI-KEY": config.cKey } })
        .then(Response => Response.json())
        .then(data => {
            data.forEach(state => {
                const option = document.createElement('option');
                option.value = state.iso2;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading states:', error);
            hideLoading();
        });
}

function loadCities() {
    showLoading(); // Show loading indicator before fetching cities
    citySelect.disabled = false;
    citySelect.style.pointerEvents = 'auto';

    const selectedCountryCode = countrySelect.value;
    const selectedStateCode = stateSelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';

    fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, { headers: { "X-CSCAPI-KEY": config.cKey } })
        .then(Response => Response.json())
        .then(data => {
            data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
            hideLoading(); // Hide loading indicator after cities are loaded
        })
        .catch(error => {
            console.error('Error loading cities:', error);
            hideLoading(); // Hide loading indicator even on error
        });
}

window.onload = loadCountries;
countrySelect.addEventListener('change', loadStates);
stateSelect.addEventListener('change', loadCities);



let apiRequest = new XMLHttpRequest();
apiRequest.onreadystatechange = () => {
    if (apiRequest.readyState === 4) {
        if (apiRequest.status === 404) {
            reportSection.textContent = 'City not found!';
        } else if (apiRequest.status === 200) {
            //const response = JSON.parse(apiRequest.response);
            //reportSection.textContent = `The weather in ${weatherData.name} is ${weatherData.weather[0].main} with a temperature of ${weatherData.main.temp}°C.`;
        }
    }
};
const cityForm = document.getElementById('city-form');
const reportSection = document.getElementById('weather-report');

cityForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const chosenCity = citySelect.value;
  showLoading()

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${chosenCity}&appid=b34fddd3dae4a2eb0ad363b62f98ba1e&units=metric`); // units=metric for Celsius
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    apiRequest.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&APPID=b34fddd3dae4a2eb0ad363b62f98ba1e');
    apiRequest.send();
    const weatherData = await response.json();
    reportSection.textContent = `The weather in ${weatherData.name} is ${weatherData.weather[0].main} with a temperature of ${weatherData.main.temp}°C.`;
  } catch (error) {
    reportSection.textContent = `Error fetching weather data: ${error.message}`;
    console.error("Weather API Error:", error);
  } finally {
    hideLoading();
  }
});

/*cityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosenCity = citySelect.value;
    loadingIndicator.style.display = 'flex'; // Show loading indicator
    apiRequest.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&APPID=b34fddd3dae4a2eb0ad363b62f98ba1e');
    apiRequest.send();
});*/

/*window.addEventListener("load", () => {
    const main = document.querySelector(".main1");
    const loader = document.querySelector(".loader");
  
    //Use classList.add instead of setting the style directly
    loader.classList.add("loader-hidden");
  
    // Use a timeout or transitionend for better reliability
    loader.addEventListener("transitionend", () => {
      if (loader && loader.parentNode) { //Check if loader and its parent exist
        loader.remove(); // Use remove() which is more modern and efficient
      }
    });
    // Add a timeout as a backup
    setTimeout(() => {
        if (loader && loader.parentNode) {
        loader.remove();
        }
    }, 500); // Adjust the timeout as needed (e.g., to match your CSS transition duration)
});*/