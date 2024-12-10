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
    showLoading();
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