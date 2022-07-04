import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
  let history = useHistory();

  const initalForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
  };

  const [form, setForm] = useState({...initalForm});
  const [error, setError] = useState(null);

  function handleChange(e, key) {
    setForm({ ...form, [key]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReservation({...form, people: Number(form.people)}, AbortController.signal);
      history.push(`/dashboard?date=${form.reservation_date}`);
    } 
    catch(err){
      setError(err);
      console.log(err);
    }
  }

  const handleCancel = () => {
    history.goBack();
  }

  return (
    <>
    <h1> Create A Reservation </h1>
    <ErrorAlert error={error} />
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
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
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
      <button type="cancel" onClick={handleCancel}>Cancel</button>
    </form>
    </>
  );
}

export default NewReservation;
