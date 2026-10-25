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
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        updatePerson();
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNum,
    };

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
    });
    setNewName("");
    setNewNum("");
  };

  const updatePerson = () => {
    const person = persons.find((p) => p.name === newName);
    const personObject = {
      name: newName,
      number: newNum,
      id: person.id,
    };
    personService.update(personObject).then((returnedPerson) => {
      setPersons(persons.map((p) => (p.id === person.id ? returnedPerson : p)));
      setNewName("");
      setNewNum("");
    });
  };

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      personService.remove(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
      });
    }
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
      <Persons search={search} persons={persons} toggleRemove={deletePerson} />
    </div>
  );
};

export default App;
