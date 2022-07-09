import React, { useEffect, useState,useCallback } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router";
import { previous, today, next } from "../utils/date-time";
import TableHeader from "./TableHeader";
import ReservationInfo from "../reservations/ReservationInfo";
import TableInfo from "../tables/TableInfo";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const { search } = useLocation();
  const history = useHistory();

  if (search) {
    date = search.replace("?date=", "");
  }

  const loadDashboard =  useCallback(async () => {
    const abortController = new AbortController();
    try {
      const [reservationsResponse, tablesResponse] = await Promise.all([
        listReservations({ date }, abortController.signal),
        listTables(abortController.signal),
      ]);
      setReservations(reservationsResponse);
      setTables(tablesResponse);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, [date])

  useEffect(() => {
    const abortController = new AbortController();
    loadDashboard();
    return () => abortController.abort();
  }, [date, loadDashboard]);

  function clearTables(tables) {
    let result = [];
    tables.forEach((table) => {
      if (table.reservation_id) {
        result.push(table);
      }
    });
    return result;
  }
  let clearTableToggler = clearTables(tables);

  const handlePrevious = (e) => {
    e.preventDefault();
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const handleToday = (e) => {
    e.preventDefault();
    history.push(`/dashboard?date=${today()}`);
  };

  const handleNext = (e) => {
    e.preventDefault();
    history.push(`/dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={error} />
      <table className="table table-striped">
        <TableHeader
          headers={[
            "ID",
            "First Name",
            "Last Name",
            "Party Size",
            "Phone Number",
            "Date",
            "Time",
            "Status",
            "Actions",
          ]}
        />
        <tbody>
          {reservations
            .filter((reservation) => reservation.status !== "finished")
            .map((reservation) => (
              <ReservationInfo
                date={date}
                reservation={reservation}
                key={reservation.reservation_id}
                setError={setError}
              />
            ))}
        </tbody>
      </table>
      <div>
        <button type="button" onClick={handlePrevious}>
          Previous
        </button>
        <button type="button" onClick={handleToday}>
          Today
        </button>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>

      <div>
        <h4> Tables List </h4>
        <ErrorAlert error={error} />
        <table className="table table-striped">
          <TableHeader
            headers={[
              "ID",
              "Table Name",
              "Capacity",
              "Reservation ID",
              "Table Status",
              "Clear Tables",
            ].filter((header) => {
              if (header === "Clear Tables") {
                return Boolean(clearTableToggler.length);
              }
              return header;
            })}
          />
          <tbody>
            {tables.map((table) => (
              <TableInfo table={table} loadDashboard={loadDashboard} key={table.table_id} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
