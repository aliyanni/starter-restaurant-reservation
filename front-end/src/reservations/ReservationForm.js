import React, { useEffect, useState } from "react";
import {
  createReservation,
  getReservation,
  updateReservation,
} from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({ isEdit = false }) {
  let history = useHistory();

  const initalForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
  };

  const [form, setForm] = useState({ ...initalForm });
  const [error, setError] = useState(null);

  const { reservation_id } = useParams();

  useEffect(() => {
    // If we are editing, get the reservation so we can prefill the form
    if (isEdit) {
      getReservation(reservation_id)
        .then((response) => {
          setForm({
            ...response,
            reservation_date: response.reservation_date.slice(0, response.reservation_date.indexOf('T'))
          });
        })
        .catch(setError);
    }
    // Don't do anything if not editing
    return;
  }, [reservation_id, isEdit]);

  function handleChange(e, key) {
    setForm({ ...form, [key]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const abortController = new AbortController();
      setError(null);
      if (isEdit) {
        await updateReservation(
          { ...form, people: Number(form.people) },
          abortController.signal
        );
      } else {
        await createReservation(
          { ...form, people: Number(form.people) },
          abortController.signal
        );
      }
      history.push(`/dashboard?date=${form.reservation_date}`);
      return () => abortController.abort();
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <h1>{isEdit ? "Edit" : "Create"} A Reservation</h1>
      <ErrorAlert error={error} />
      {isEdit && form.status !== "booked" ? (
        <p>
          You can't edit this reservation. A reservation must be in the 'booked'
          status to edit.
        </p>
      ) : (
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
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
}

export default ReservationForm;
