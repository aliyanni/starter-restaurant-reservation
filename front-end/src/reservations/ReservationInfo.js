import React from "react";

function ReservationInfo({ date, reservation }) {
  return (
    <tr>
      <th scope="row"> {reservation.reservation_id} </th>
      <td> {reservation.first_name} </td>
      <td> {reservation.last_name} </td>
      <td> {reservation.people} </td>
      <td> {reservation.mobile_number} </td>
      <td> {reservation.reservation_date} </td>
      <td> {reservation.reservation_time} </td>
      <td data-reservation-id-status={reservation.reservation_id}> {reservation.status} </td>
      <td>
        {reservation.status === "booked" && (
          <a href={`/reservations/${reservation.reservation_id}/seat?date=${date}`}>
            <button className="btn btn-primary">Seat</button>
          </a>
        )}
      </td>
    </tr>
  );
}

export default ReservationInfo;
