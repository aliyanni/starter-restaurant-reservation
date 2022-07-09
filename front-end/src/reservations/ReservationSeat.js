import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, updateSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation } from "react-router";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tableFormData, setTableFormData] = useState({});
  const [error, setError] = useState(null);
  let date;
  const { search } = useLocation();
  if (search) {
    date = search.replace("?date=", "");
  }

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);

    return () => abortController.abort();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const tableObj = JSON.parse(tableFormData);
    try {
      const updatedTable = await updateSeat(tableObj.table_id, reservation_id, abortController.signal);
      const newTables = tables.map((table) =>
        table.table_id === updatedTable.table_id ? updatedTable : table
      );
      setTables(newTables);
      history.push(`/dashboard${date ? `?date=${date}` : ""}`);
    } catch (err) {
      setError(err);
    }
  };

  if (tables) {
    return (
      <>
        <div className="mb-3">
          <h1>Seat The Current Reservation</h1>
        </div>

        <ErrorAlert error={error} />

        <div className="mb-3">
          <h3> Current Reservation: {reservation_id} </h3>
        </div>

        <form className="form-group" onSubmit={handleSubmit}>
          <div className="col mb-3">
            <label className="form-label" htmlFor="table_id">
              Select Table
            </label>
            <select
              className="form-control"
              name="table_id"
              id="table_id"
              onChange={(event) => setTableFormData(event.target.value)}
            >
              <option value=""> Table Name - Capacity </option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={JSON.stringify(table)}
                  required={true}
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </>
    );
  } else {
    return (
      <div>
        <h1>No Open Tables</h1>
      </div>
    );
  }
}

export default ReservationSeat;
