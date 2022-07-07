import React from "react";

function ReservationInfo({ reservation }) {
  return (
      <tr>
        <th scope="row"> {reservation.reservation_id} </th>
        <td> {reservation.first_name} </td>
        <td> {reservation.last_name} </td>
        <td> {reservation.people} </td>
        <td> {reservation.mobile_number} </td>
        <td> {reservation.reservation_date} </td>
        <td> {reservation.reservation_time} </td>
        <td>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button className="btn btn-primary">Seat</button>
          </a>
        </td>
      </tr>
  );
}

export default ReservationInfo;