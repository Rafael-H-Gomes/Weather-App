import { apiKey } from '../../apiKey.js';

const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&language=pt-br`

const searchInput = document.getElementById('search')

const getSearchResult = async () => {
  console.log(searchInput.value)
}