import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;


const inputRef = document.querySelector("#search-box")
const countryListRef = document.querySelector(".country-list")
const countryInfoRef = document.querySelector(".country-info")

inputRef.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY))

function onInput() {
    if (inputRef !== "") {
        fetchCountries(inputRef.value)
        .then(loadCountries)
        .catch(error => error)
    }
    else renderCountryList('')
}

function loadCountries(countries) {
    if (countries === ""){
        clearMarkup()
    }
    else if (countries.length > 10){
        clearMarkup()
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
    }
    else if (countries.length === 1){
        countryListRef.innerHTML = ""
        countryInfoRef.innerHTML = markupForCountry(...countries)
    }
    else if (countries.length > 1 && countries.length < 10){
        countryInfoRef.innerHTML = ""
        return countryListRef.insertAdjacentHTML(
            'beforeend', countries.map(markupForCountryList).join('')
        )
    }
}

function fetchCountries(name){
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => {
        if (!response.ok){
            throw new Error(Notiflix.Notify.failure("Oops, there is no country with that name"))
        }
        return response.json()
    })
    .catch(error => error);
    // console.log(name)
}

function markupForCountry({ name, population, capital, languages, flags }){
    return `
    <div>
    <h2>
    <img src="${flags.svg}" width="60" height="40">
    ${name.official}</h2>
    <p><span>Capital: </span> ${capital}</p>
    <p><span>Population: </span>${population}</p>
    <p><span>Languages: </span>${Object.values(languages).join(', ')}</p>
    </div>
    `;
}

function markupForCountryList({ flags, name }) {
    return `<li><img src="${flags.svg}" width="30" height="15"> ${name.official}</li>`;
}

function clearMarkup(act) {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
}