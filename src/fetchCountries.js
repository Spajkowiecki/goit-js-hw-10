const page = 'https://restcountries.com/v3.1';

function fetchCountries(name) {
  return fetch(
    `${page}/name/${name}?fields=name,capital,population,flags,languages`
  );
}

export { fetchCountries };
