import './css/styles.css';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
const { log } = console;

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('input');
const countriesList = document.getElementsByClassName('country-list');

const countryInfo = document.querySelector('.country-info');

// const bigInfo = country => {
//   const li = document.createElement('li');
//   li.innerHTML = `<div>
//   <div class=big-info-header><img src="${country.flags.svg}"/><span>${
//     country.name.common
//   }</span></div>
//   <p>Capital: ${country.capital}</p>
//   <p>Population: ${country.population}</p>
//   <p>Languages: ${Object.values(country.languages).join(', ')}</p></div>`;
//   countriesList[0].appendChild(li);
// };

// const removeInfo = () => {
//   const element = document.querySelector('ul');
//   while (element.firstChild) {
//     element.removeChild(element.firstChild);
//   }
// };

// const smallInfo = country => {
//   countriesList[0].insertAdjacentHTML(
//     'beforeend',
//     `<li><img class="info-box-small" src="${country.flags.svg}"/><p>${country.name.common}</p></li>`
//   );
// };

// //show countries list matching input
// const displayInfo = async event => {
//   //clearing last countries display
//   removeInfo();
//   const value = event.target.value;
//   if (value !== '') {
//     const response = await fetchCountries(value);
//     if (response.ok) {
//       const country = await response.json();
//       if (country.length === 1) {
//         //only if exist 1 country
//         country.forEach(c => bigInfo(c));
//       } else if (country && country.length > 1 && country.length <= 10) {
//         console.log(country);
//         Notiflix.Notify.info(
//           'Too many matches found. Please enter a more specific name.'
//         );
//         country.forEach(c => smallInfo(c));
//       }
//     } else if (response.status === 404) {
//       Notiflix.Notify.failure('Oops, there is no country with that name');
//     }
//   } else if (value === '') {
//     removeInfo();
//   }
// };

// searchBox.addEventListener('input', debounce(displayInfo, DEBOUNCE_DELAY));

//big infoBar
const detailBox = country => {
  //wstrzykniecie elementu 'li'
  const div = document.createElement('div');
  div.classList.add('detailBox');
  div.innerHTML = `<div class=detailBox-header>
  <img class="box-img" src="${country.flags.svg}" alt="flag of ${
    country.name.common
  }"><div class="box-main"><p><b>${
    country.name.common
  }</b></p><p><b>Capital:</b> ${country.capital}</p></div></div>
  <div class="box-info"><p><b>Population: </b>${
    country.population
  }</p><p><b>Languages:</b> ${Object.values(country.languages).join(
    ', '
  )}</p></div>`;

  countryInfo.appendChild(div);
};

//small infoBar
const infoBar = country => {
  //wstrzykniecie elementu 'li'
  countriesList[0].insertAdjacentHTML(
    'beforeend',
    `<li class="list-item"><button class="country-button"><img class="info-box-small" src="${country.flags.svg}"/><p>${country.name.common}</p></button></li>`
  );
};

function removeInfoBar() {
  while (countriesList[0].firstChild) {
    countriesList[0].removeChild(countriesList[0].firstChild);
  }
}

const sendRequest = async event => {
  removeInfoBar();
  const value = event.target.value;
  if (value !== '') {
    //here i get promise
    const promise = await fetchCountries(value);
    if (promise.ok) {
      //If promise is ok= code 200
      const countries = await promise.json();
      //checking countries amout
      if (countries.length === 1) {
        //clear previous displayed country
        countryInfo.removeChild(countryInfo.firstChild);
        countries.forEach(country => detailBox(country));
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length > 1 && countries.length <= 10) {
        countries.forEach(element => {
          infoBar(element);
        });
      }
    } else if (promise.status === 404) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
    //==========================
  } else if (value === '') {
    removeInfoBar();
  }
};

searchBox.addEventListener('input', debounce(sendRequest, DEBOUNCE_DELAY));
