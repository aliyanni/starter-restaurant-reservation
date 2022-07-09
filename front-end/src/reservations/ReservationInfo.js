import React from "react";
import { useHistory } from "react-router";
import { updateResStatus } from "../utils/api";

function ReservationInfo({ reservation, setError }) {
  const history = useHistory();
  const abortController = new AbortController();
  const handleCancelReservation = async (event) => {
    event.preventDefault();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await updateResStatus(
          { status: "cancelled" },
          reservation.reservation_id,
          abortController.signal
        );
        history.push("/dashboard");
      } catch (err) {
        setError(err);
      }
    }
  };

  return (
    <tr>
      <th scope="row"> {reservation.reservation_id} </th>
      <td> {reservation.first_name} </td>
      <td> {reservation.last_name} </td>
      <td> {reservation.people} </td>
      <td> {reservation.mobile_number} </td>
      <td> {reservation.reservation_date} </td>
      <td> {reservation.reservation_time} </td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      <td>
        {reservation.status === "booked" && (
          <>
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
            >
              <button className="btn btn-primary">Seat</button>
            </a>
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-primary ml-2">Edit</button>
            </a>
            <button
              data-reservation-id-cancel={`${reservation.reservation_id}`}
              className="btn btn-danger ml-2"
              onClick={handleCancelReservation}
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default ReservationInfo;
