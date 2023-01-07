import './css/styles.css';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('input');
const countriesList = document.getElementsByClassName('country-list');

const bigInfo = country => {
  const li = document.createElement('li');
  li.innerHTML = `<div>
  <div class=big-info-header><img src="${country.flags.svg}"/><span>${
    country.name.common
  }</span></div>
  <p>Capital: ${country.capital}</p> 
  <p>Population: ${country.population}</p> 
  <p>Languages: ${Object.values(country.languages).join(', ')}</p></div>`;
  countriesList[0].appendChild(li);
};

const removeInfo = () => {
  const element = document.querySelector('ul');
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const smallInfo = country => {
  countriesList[0].insertAdjacentHTML(
    'beforeend',
    `<li><img class="info-box-small" src="${country.flags.svg}"/><p>${country.name.common}</p></li>`
  );
};

//show countries list matching input
const displayInfo = async event => {
  //clearing last countries display
  removeInfo();
  const value = event.target.value;
  if (value !== '') {
    const response = await fetchCountries(value);
    if (response.ok) {
      const country = await response.json();
      if (country.length === 1) {
        //only if exist 1 country
        country.forEach(c => bigInfo(c));
      } else if (country && country.length > 1 && country.length <= 10) {
        console.log(country);
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        country.forEach(c => smallInfo(c));
      }
    } else if (response.status === 404) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
  } else if (value === '') {
    removeInfo();
  }
};

searchBox.addEventListener('input', debounce(displayInfo, DEBOUNCE_DELAY));
