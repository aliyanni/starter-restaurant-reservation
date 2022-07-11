import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
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

  function handleChange(e, key) {
    setForm({ ...form, [key]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const abortController = new AbortController();
      setError(null);
      await createReservation(
        { ...form, people: Number(form.people) },
        abortController.signal
      );
      history.push(`/dashboard?date=${form.reservation_date}`);
      return () => abortController.abort();
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  return (
    <>
      <h1>Create A Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default CreateReservation;
