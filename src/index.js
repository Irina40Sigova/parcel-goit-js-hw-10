import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

import  fetchCountries  from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

searchRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let inputCountry = e.target.value.trim();

  if (inputCountry) {
    return fetchCountries(inputCountry)
      .then(data => {
        choseMarkup(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }

  countryInfoRef.innerHTML = '';
  countryListRef.innerHTML = '';
}

countryListRef.style.listStyle = 'none';
countryListRef.style.margin = '0';
countryListRef.style.padding = '8px';

function choseMarkup(countryArray) {
  if (countryArray.length === 1) {
    countryListRef.innerHTML = '';
    return markupCountry(countryArray);
  }
  if (countryArray.length >= 2 && countryArray.length <= 10) {
    countryInfoRef.innerHTML = '';
    return markupCountryItem(countryArray);
  }

  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupCountryItem(data) {
  const markup = data
    .map(el => {
      return `<li class="country-item">
            <img src="${el.flags.svg}" alt="${el.name.official}" width="40" height="20" /> 
            <p>${el.name.official}</p>
            </li>`;
    })
    .join('');

  countryListRef.innerHTML = markup;
}

function markupCountry(data) {
  const markup = data
    .map(el => {
      return `<h1>
       <img src="${el.flags.svg}" alt="${
        el.name.official
      }" width="40" height="20" /> 
            
        ${el.name.official}
      </h1>
      <ul class="country-info_list">
        <li class="country-info_item">
          <h2>Capital:</h2>
          <p>${el.capital}</p>
        </li>
        <li class="country-info_item">
          <h2>Population:</h2>
          <p>${el.population}</p>
        </li>
        <li class="country-info_item">
          <h2>Languages:</h2>
          <p>${Object.values(el.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  countryInfoRef.innerHTML = markup;
}