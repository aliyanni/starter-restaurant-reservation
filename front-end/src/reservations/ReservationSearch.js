import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TableHeader from "../dashboard/TableHeader";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

import ReservationInfo from "./ReservationInfo";

function ReservationSearch() {
  const [mobile_number, setMobile_number] = useState('');
  const [reservations, setReservations] = useState(null);
  const history = useHistory();
  const [error, setError] = useState('No reservations found');

  const handleSubmit = (e) => {
      e.preventDefault();
      setError(null);
      listReservations({ mobile_number })
      .then((response) => {
        setReservations(response)
        // history.push('/search')
      })
      .catch(setError('No reservations found'))
  }

  return (
    <>
      <div className="mb-3">
          <h1> Find Reservation </h1>
      </div>
      
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
          <button type="submit" className="btn btn-primary"> find </button>
        </div>
      </form>
      <br />
      {reservations && reservations.length ?
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
            "Seat",
          ]}
        />
          <tbody>
            {reservations.map((reservation) => (
              <ReservationInfo reservation={reservation} />
            ))}
          </tbody>
        </table>
      </div>
      :
      <>
       <ErrorAlert error={{ message: error }} />
      </>
      }
    </>
  );
}

export default ReservationSearch;