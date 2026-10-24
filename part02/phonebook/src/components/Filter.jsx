const Filter = ({ search, onSearchChange }) => {
  return (
    <form>
      filter shown with <input value={search} onChange={onSearchChange} />
    </form>
  );
};

export default Filter;
