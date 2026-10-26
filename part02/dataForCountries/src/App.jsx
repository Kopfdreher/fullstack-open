import { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./components/Countries";

const App = () => {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState(null);
  const [countries, setCountries] = useState([]);

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (country) {
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then((response) => {
          setCountries(response.data);
        });
    }
  }, [country]);

  const onSearch = (event) => {
    event.preventDefault();
    setCountry(value);
  };

  const filteredCountries = country
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(country.toLowerCase()),
      )
    : [];

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries <input value={value} onChange={handleValueChange} />
      </form>
      <Countries key={country} filteredCountries={filteredCountries}/>
    </div>
  );
};

export default App;
