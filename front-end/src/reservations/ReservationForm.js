import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ form, handleChange, handleSubmit }) {
  let history = useHistory();

  return (
        <form onSubmit={handleSubmit}>
          <label htmlFor="first_name">
            First Name:
            <input
              id="first_name"
              type="text"
              name="first_name"
              onChange={(e) => handleChange(e, "first_name")}
              value={form.first_name}
            />
          </label>
          <label htmlFor="last_name">
            Last Name:
            <input
              id="last_name"
              type="text"
              name="last_name"
              onChange={(e) => handleChange(e, "last_name")}
              value={form.last_name}
            />
          </label>
          <label htmlFor="mobile_number">
            Mobile Number:
            <input
              id="mobile_number"
              type="tel"
              name="mobile_number"
              placeholder="555-555-5555"
              onChange={(e) => handleChange(e, "mobile_number")}
              value={form.mobile_number}
            />
          </label>
          <label htmlFor="reservation_date">
            Reservation Date:
            <input
              id="reservation_date"
              type="date"
              name="reservation_date"
              placeholder="DD-MM-YYY"
              pattern="\d{2}-\d{2}-\d{4}"
              onChange={(e) => handleChange(e, "reservation_date")}
              value={form.reservation_date}
            />
          </label>
          <label htmlFor="reservation_time">
            Reservation Time:
            <input
              id="reservation_time"
              type="time"
              name="reservation_time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={(e) => handleChange(e, "reservation_time")}
              value={form.reservation_time}
            />
          </label>
          <label htmlFor="people">
            People:
            <input
              id="people"
              type="number"
              name="people"
              onChange={(e) => handleChange(e, "people")}
              value={form.people}
            />
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={history.goBack}>
            Cancel
          </button>
        </form>
  );
}

export default ReservationForm;
