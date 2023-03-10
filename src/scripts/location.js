import { apiKey } from '../../apiKey.js';

const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&language=pt-br`

const searchInput = document.getElementById('search')
const form = document.querySelector('.search-input form')
const submitButton = document.querySelector('.submit-icon')
const loader = document.querySelector('.loader')
const resultsDropdown = document.querySelector('.results-dropdown')

const getSearchResult = () => {

  submitButton.style.display = 'none'
  loader.style.display = 'flex'

  fetch(`${url}&q=${searchInput.value.toLowerCase()}`)
    .then(response => {
      
      submitButton.style.display = ''
      loader.style.display = 'none'

      return response.json()
    })
    .then(data => {
      const searchResults = []

      searchResults.push(data)
      
      console.log(searchResults)

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
            </div>
          `
        }
  
        resultsDropdown.style.display = 'block'
      }

    })
    .catch((err) => {console.error(err)})

}

const resultLine = document.querySelector('.result-line')

const getCityKey = () => {
  console.log('')
}

searchInput.addEventListener('change', getSearchResult)
form.addEventListener('submit', (event) => event.preventDefault())