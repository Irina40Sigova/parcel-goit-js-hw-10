import './css/styles.css';
import fetchCountries from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const input = document.getElementById("search-box");
const divInfo = document.querySelector(".country-info");
const ulEL = document.querySelector('.country-list');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

 function onInput(e) {
  let country = e.target.value.trim();

  if (country) {
    return fetchCountries(country)
      .then(data => {
        choseMarkup(data);
      })
      .catch(onError);
  }
  divInfo.innerHTML = '';
  ulEL.innerHTML = '';
};


ulEL.style.listStyle = 'none';
ulEL.style.margin = '0';
ulEL.style.padding = '8px';

function choseMarkup(countryArray) {
  if (countryArray.length === 1) {
    ulEL.innerHTML = '';
    return  markupCountry(countryArray);
  }
  if (countryArray.length >= 2 && countryArray.length <= 10) {
    divInfo.innerHTML = '';
    return createMarkup(countryArray);
  }

  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupCountry(data) {
  const markup = data
    .map(el => {
      return `<li class="country-item">
            <img src="${el.flags.svg}" alt="${el.name.official}" width="40" height="20" /> 
            <p>${el.name.official}</p>
            </li>`;
    })
    .join('');

  ulEL.innerHTML = markup;
}

 function createMarkup(data){
   const countryInfo = data.map(el =>{
    return `<h1>
           <img src="${el.flags.svg}" alt="${
            el.name.official
          }" width="40" height="20" /> 
          </h1>
          <ul class="country-list">
            <li class="country-item">
              <h2>Capital:</h2>
              <p>${el.capital}</p>
            </li>
            <li class="country-item">
              <h2>Population:</h2>
              <p>${el.population}</p>
            </li>
            <li class="country-item">
              <h2>Languages:</h2>
              <p>${Object.values(el.languages).join(', ')}</p>
            </li>
          </ul>`;
  })
  .join('');
  divInfo.innerHTML = countryInfo;
};

function onError (err){
  Notify.failure("Oops, there is no country with that name");
};





