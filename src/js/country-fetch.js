export function fetchCountries(name){
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => {
        if (!response.ok){
            countryListRef.innerHTML = ""
            throw new Error(response.status)
        }
        return response.json()
    })
    .catch(error => error);
    // console.log(name)
}