const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const cityCountryElement = document.querySelector('.container .city-country');
const error404 = document.querySelector('.not-found');
const temperature = document.querySelector('.weather-box .temperature');

let isFahrenheit = false;

async function getCityCountryInfo(city) {
    const APIKey = '2437a4c75fbf487f697570c80773f8c5';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`);
    const data = await response.json();
  
    if (data.cod === '404') {
      return null;
    }
  
    const cityCountryInfo = {
      city: data.name,
      country: data.sys.country,
    };
  
    return cityCountryInfo;
  }
  

  async function searchWeather() {
    const APIKey = '2437a4c75fbf487f697570c80773f8c5';
    const cityInput = document.querySelector('.search-box input');
    const city = cityInput.value;

    if (city === '') {
        return;
    }

    try {
        const json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
            .then(response => response.json());

        const cityCountryInfo = await getCityCountryInfo(city);

        if (json.cod === '404') {
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            cityCountryElement.style.display = 'none'
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
            return;
        }

        error404.style.display = 'none';
        error404.classList.remove('fadeIn');

        const image = document.querySelector('.weather-box img');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        switch (json.weather[0].main) {
            case 'Clear':
                image.src = 'images/clear.png';
                break;

            case 'Rain':
                image.src = 'images/rain.png';
                break;

            case 'Snow':
                image.src = 'images/snow.png';
                break;

            case 'Clouds':
                image.src = 'images/cloud.png';
                break;

            case 'Haze':
                image.src = 'images/mist.png';
                break;

            default:
                image.src = '';
        }

        const cityTimezone = json.timezone / 3600; // Time zone received
        const currentUTCHour = new Date().getUTCHours();
        const currentLocalHour = currentUTCHour + cityTimezone;

        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

        // Show time of city and country
        const options = {
            timeZone: `Etc/GMT${cityTimezone >= 0 ? '-' : '+'}${Math.abs(cityTimezone)}`,
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };

        const cityTime = new Intl.DateTimeFormat('en-US', options).format(new Date());

        // Add city and country
        if (cityCountryInfo) {
            cityCountryElement.innerHTML = `${cityCountryInfo.city}, ${cityCountryInfo.country}`;
            cityCountryElement.innerHTML += ` - ${cityTime}`;
        } else {
            cityCountryElement.innerHTML = '';
        }

        // Change background color according to city time
        const isNight = currentLocalHour < 6 || currentLocalHour > 18;

        if (isNight) {
            document.body.style.background = '#08162A'; // Night background color
        } else {
            document.body.style.background = '#06283D'; // Day background color
        }


        weatherBox.style.display = '';
        weatherDetails.style.display = '';
        cityCountryElement.style.display = '';
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
        cityCountryElement.classList.add('fadeIn');
        container.style.height = '590px';

        // Her arama sonrasında sıcaklık birimini Celsius'a çevir
        isFahrenheit = false;
        toggleTemperature();

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const toggleButton = document.getElementById('toggleButton');

function toggleTemperature() {
    const temperatureValue = parseInt(temperature.innerText);

    if (isFahrenheit) {
        // Convert Fahrenheit to Celsius
        const celsiusValue = ((temperatureValue - 32) * 5) / 9;
        temperature.innerHTML = `${Math.round(celsiusValue)}<span>°C</span>`;
        toggleButton.innerHTML = '°F';
    } else {
        // Convert Celsius to Fahrenheit
        const fahrenheitValue = (temperatureValue * 9) / 5 + 32;
        temperature.innerHTML = `${Math.round(fahrenheitValue)}<span>°F</span>`;
        toggleButton.innerHTML = '°C';
    }

    isFahrenheit = !isFahrenheit;
}

toggleButton.addEventListener('click', toggleTemperature);

search.addEventListener('click' , searchWeather);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchWeather();
    }
});