import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNum,
      id: String(persons.length + 1),
    };

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNum("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumChange = (event) => {
    setNewNum(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNum={newNum}
        onNameChange={handleNameChange}
        onNumChange={handleNumChange}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons search={search} persons={persons} />
    </div>
  );
};

export default App;
