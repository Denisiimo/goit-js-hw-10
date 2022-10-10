import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/country-fetch';
const DEBOUNCE_DELAY = 300;


const inputRef = document.querySelector("#search-box")
const countryListRef = document.querySelector(".country-list")
const countryInfoRef = document.querySelector(".country-info")

inputRef.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY))

function onInput(event) {
    if (event.target.value !== "") {
        fetchCountries(inputRef.value)
        .then(loadCountries)
    }
    else loadCountries('')
}

function loadCountries(countries) {
    if (countries.length === 0){
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
    else if (error => error) {
        Notiflix.Notify.failure('Oops, there is no country with that name')
    }
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
