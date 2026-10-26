import { useState } from "react";

const Countries = ({ filteredCountries }) => {
  const [show, setShow] = useState(null);

  if (show || filteredCountries.length === 1) {
    const country = show ? show : filteredCountries[0];

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>
          Capital {country.capital}
          <br />
          Area {country.area}
        </p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} width="200" />
      </div>
    );
  }

  if (filteredCountries.length === 0) {
    return <p>No Countries found</p>;
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches specify another filter</p>;
  }

  const handleShow = (c) => {
    setShow(c);
  };

  return (
    <ul className="countriesList">
      {filteredCountries.map((c) => (
        <li key={c.name.common}>
          {c.name.common}
          <button onClick={() => handleShow(c)}>show</button>
        </li>
      ))}
    </ul>
  );
};

export default Countries;
