function TableHeader({ headers }) {
  return (
    <thead>
      <tr>
        {headers.map((element, i) => (
          <th key={i} scope="col">{element}</th>
        ))}
      </tr>
    </thead>
  );
}
export default TableHeader;
