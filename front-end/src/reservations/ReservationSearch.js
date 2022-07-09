import React, { useState } from "react";
import TableHeader from "../dashboard/TableHeader";
import ErrorAlert from '../layout/ErrorAlert';
import { listReservations } from "../utils/api";

import ReservationInfo from "./ReservationInfo";

function ReservationSearch() {
  const [mobile_number, setMobile_number] = useState("");
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    setError(null);
    try {
      const reservationsResponse = await listReservations({ mobile_number }, abortController.signal)
      setReservations(reservationsResponse)
    } catch (err) {
      setError(err)
    }
  };

  return (
    <>
      <div className="mb-3">
        <h1> Find Reservation </h1>
      </div>
      <ErrorAlert error={error}/>
      <form className="form-group mb-3" onSubmit={handleSubmit}>
        <input
          type="search"
          name="mobile_number"
          className="form-control rounded mb-2"
          placeholder="Enter a customer's phone number"
          onChange={(event) => setMobile_number(event.target.value)}
          value={mobile_number}
        />
        <div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
      <br />
      <div>
        <h3 className="mb-3"> Matching Reservations </h3>
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
            {reservations && reservations.length ?
            reservations.map((reservation) =>
               (
                <ReservationInfo reservation={reservation} setError={setError} />
              )) : (
                <p>No reservations found</p>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ReservationSearch;
