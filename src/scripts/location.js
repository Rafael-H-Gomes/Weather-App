import { apiKey } from '../../apiKey.js';

const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&language=pt-br`

const searchInput = document.getElementById('search')
const form = document.querySelector('.search-input form')
const submitButton = document.querySelector('.submit-icon')
const loader = document.querySelector('.loader')
const resultsDropdown = document.querySelector('.results-dropdown')
const cardsContainer = document.querySelector('.cards-container')

// const close = document.querySelector('.close')

// close.addEventListener('click', function() {deleteCard()})

const activeCards = [];

//verifica se ja tem alguma key salva
let existingData = localStorage.getItem('resultKeys');

//se tiver, armazena na const resultKeys, se não tiver, retorna um array vazio
let resultKeys = existingData ? JSON.parse(existingData) : [];

const createCardData = (key) => {
  const locationByKeyUrl = `https://dataservice.accuweather.com/locations/v1/${key}?apikey=${apiKey}&language=pt-br`;
  const currentConditionsUrl = `https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${apiKey}&language=pt-br&details=true`;
  const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=${apiKey}&language=pt-br&details=true`;

  Promise.all([
    fetch(locationByKeyUrl),
    fetch(currentConditionsUrl),
    fetch(forecastUrl)
  ])
    .then(responses => {
      return Promise.all(responses.map(response => response.json()));
    })
    .then(data => {
      const [api1Data, api2Data, api3Data] = data;

      // combina os dados das três APIs em um único objeto
      const result = {
        locationKey: api1Data.Key,
        cityName: api1Data.LocalizedName,
        country: api1Data.AdministrativeArea.CountryID,
        temperature: api2Data[0].Temperature.Metric.Value,
        currentCondition: api2Data[0].WeatherText,
        weatherIcon: api2Data[0].WeatherIcon,
        windSpeed: api2Data[0].Wind.Speed.Metric.Value,
        humidity: api2Data[0].RelativeHumidity,
        chanceOfRain: api3Data.DailyForecasts[0].Day.PrecipitationProbability,
      };

      activeCards.push(result);
      // console.log(activeCards);
      // console.log(result);
    })
    .catch(error => {
      console.error(error);
    });
}

const showCards = () => {
  cardsContainer.innerHTML = ``;
  for(let card of activeCards) {
    // cardsContainer.innerHTML +=
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
        <div class="card-header">
          <h3 class="city">${card.cityName}</h3>
          <h3 class="uf">${card.country}</h3>
          
          <span class="close"><img src="../public/assets/x.svg" alt="close card"></span>
        </div>
        <div class="card-content">
          <span class="weather-icon">
            <img src="../public/assets/icons/${card.weatherIcon}.svg" alt="cloud">
          </span>
          <div class="actual-condition">
            <h2>${card.temperature}°C</h2>
            <p class="status">${card.currentCondition}</p>
          </div>
        </div>
        <div class="condition-details">
          <div class="info-container">
            <img class="icon" src="../public/assets/wind.svg"  alt="Wind">
            <p class="value">${card.windSpeed} km/h</p>
            <p class="info-name">Wind</p>
          </div>
          <div class="info-container">
            <img class="icon" src="../public/assets/droplet.svg"  alt="Humidity">
            <p class="value">${card.humidity}%</p>
            <p class="info-name">Humidity</p>
          </div>
          <div class="info-container">
            <img class="icon" src="../public/assets/umbrella.svg"  alt="Chance of rain">
            <p class="value">${card.chanceOfRain}%</p>
            <p class="info-name last-info-name">Chance of Rain</p>
          </div>
        </div>
    `;

    const closeElement = cardElement.querySelector('.close');
    closeElement.addEventListener('click', () => {
      deleteCard(card.locationKey)
    });

    cardsContainer.appendChild(cardElement);
  }
}

const deleteCard = (key) => {
  let itemIndex = resultKeys.findIndex(item => item === key);

  if (itemIndex !== -1) {
    resultKeys.splice(itemIndex, 1);

    localStorage.setItem('resultKeys', JSON.stringify(resultKeys));

    window.location.reload();
  }
}

for(let key of resultKeys) {
  // console.log(key);
  createCardData(key)
}

setInterval(showCards, 200);

const getSearchResult = async (callback) => {

  submitButton.style.display = 'none'
  loader.style.display = 'flex'

  fetch(`${locationUrl}&q=${searchInput.value.toLowerCase()}`)
    .then(response => {
      
      submitButton.style.display = ''
      loader.style.display = 'none'

      return response.json()
    })
    .then(data => {
      const searchResults = []

      searchResults.push(data)
      
      // console.log(searchResults)

      resultsDropdown.innerHTML = ``

      if(searchResults[0].length == 0) {
        resultsDropdown.innerHTML = `
          <div class="result-line">
            Não foram encontrados resultados para esta pesquisa, por favor tente novamente!
          </div>
        `

        resultsDropdown.style.display = 'block'

      } else {
        for(let result of searchResults[0]) {
          resultsDropdown.innerHTML += `
            <div class="result-line">
              <p class="result-city">${result.LocalizedName}</p>
              <p class="result-uf">${result.AdministrativeArea.ID}</p>
              <p class="result-country">${result.AdministrativeArea.CountryID}</p>
              <span class="result-key">${result.Key}</span>
            </div>
          `
        }
  
        resultsDropdown.style.display = 'block'
  
      }
      const resultLine = document.querySelectorAll('.result-line')

      resultLine.forEach(line => {
        line.addEventListener('click', function getWeatherByLocationKey() {
          const resultKey = line.querySelector('.result-key').textContent;

          searchInput.value = ''
          resultsDropdown.style.display = ''
          resultKeys.push(resultKey);
          console.log(resultKeys)

          callback(resultKey);
          // console.log(activeCards);
          setInterval(showCards, 200);
          
          // console.log(resultKeys);
          localStorage.setItem('resultKeys', JSON.stringify(resultKeys));
        });
      });
    })
    .catch((err) => {console.error(err)})
    
    // console.log(resultKeys);
    
}

searchInput.addEventListener('change', function() {getSearchResult(createCardData)})
form.addEventListener('submit', (event) => event.preventDefault())
