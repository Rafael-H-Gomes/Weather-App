import { apiKey } from '../../apiKey.js';

const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&language=pt-br`

const searchInput = document.getElementById('search')
const form = document.querySelector('.search-input form')
const submitButton = document.querySelector('.submit-icon')
const loader = document.querySelector('.loader')
const resultsDropdown = document.querySelector('.results-dropdown')

const resultKeys = [];
const activeCards = [];

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
            Não foram encontrados resultados para esta pesquisa, por favor tente novamente
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

          // console.log(resultKeys);

          callback()
        });
      });
    })
    .catch((err) => {console.error(err)})
    
    // console.log(resultKeys);
    
  }
  
const teste = () => {
  const conditions = []

  for(let key of resultKeys) {
    fetch(`https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${apiKey}&language=pt-br&details=true`)
      .then((response) => response.json())
      .then(data => {
        conditions.push(data[0])
      })
      .catch(err => console.error(err))
  }
  console.log(conditions)
  // console.log('oi')
}

teste();

searchInput.addEventListener('change', function() {getSearchResult(teste)})
form.addEventListener('submit', (event) => event.preventDefault())
  
export { resultKeys }


// const conditions = []

// fetch(`https://dataservice.accuweather.com/currentconditions/v1/41699?apikey=${apiKey}&language=pt-br&details=true`)
//   .then(response => response.json())
//   .then(data => {
//     conditions.push(data[0])
//   })
//   .catch(err => console.error(err))

// console.log(conditions)
// const cardData = {
//   cityName: 'Monte Aprazível',
//   country: 'BR',
//   temperature: '26',
//   weatherCondition: 'Clear',
//   icon: '7',
//   wind: '14',
//   Humidity: '60',
//   ChanceOfRain: '0'
// }

// activeCards.push(cardData);
// console.log(activeCards);