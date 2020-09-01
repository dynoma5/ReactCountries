import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY

const Filter = ({ string, method }) => {
  return (
    <>
      find countries<input value={string} onChange={method} />
    </>
  )
}

const CountryForm = ({ country, setCountry }) => {
  return (
    <>
      <button value={country} type="button" onClick={setCountry}>show</button>
    </>
  )
}

const CountryWeather = ({ cityData }) => {

  return (
    <>
      {
         typeof cityData !== 'undefined' ?
          <div>
            <h2>Weather in {cityData.location.name}</h2>
            <p><b>Temperature: </b>{cityData.current.temperature} Celcius</p>
            <img width="50" height="50" alt="forecast" src={cityData.current.weather_icons[0]} />
            <p><b>Wind: </b>{cityData.current.wind_speed}km/hr direction {cityData.current.wind_dir}</p>
          </div> :
          <p></p>
      }
    </>
  )
}
const Country = ({ data }) => {


  const [cityData, setCityData] = useState()

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${data.capital.replace(/\s/g, '')}`)
      .then(response => {
        setCityData(response.data)
      })
  }, [])

  return (
    <div>
      <h1>{data.name}</h1>
      <p>capital {data.capital}</p>
      <p>population {data.population}</p>
      <h2>Languages</h2>
      <ul>
        {
          data.languages.map(language => <li key={language.name}>{language.name}</li>)
        }
      </ul>
      <img width="100" height="100" alt="country flag" src={data.flag} />
      <CountryWeather cityData={cityData}></CountryWeather>
    </div>
  )
}

const Countries = ({ filterString, arrayList, setFilter }) => {

  const filteredList = arrayList.filter(country => country.name.toLowerCase().includes(filterString.toLowerCase()))

  const showCountry = (event) => {
    setFilter(event.target.value)
  }

  return (
    <>
      {
        filterString.length === 0 ?
          <p></p> :
          filteredList.length >= 10 ?
            <p>Too many matches, specify another filter</p> :
            filteredList.length === 1 ?
              <Country data={filteredList[0]}></Country> :
              filteredList.map(country =>
                <p key={country.numericCode}>{country.name} <CountryForm country={country.name} setCountry={showCountry}></CountryForm></p>)
      }
    </>
  )
}
const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })

  }, [])

  return (
    <div>
      <Filter string={filter} method={handleFilter}></Filter>
      <Countries filterString={filter} arrayList={countries} setFilter={setFilter}></Countries>
    </div>
  )
}

export default App;
