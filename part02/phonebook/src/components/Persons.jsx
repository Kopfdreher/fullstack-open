const Persons = ({ persons, search, toggleRemove }) => {
  const personsToShow = search
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase()),
    )
    : persons;

  return (
    <ul className="list-none pl-0">
      {personsToShow.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => toggleRemove(person)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
