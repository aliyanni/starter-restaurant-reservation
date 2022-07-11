import React, { useEffect, useState } from "react";
import { getReservation, updateReservation } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function EditReservation({ isEdit = false }) {
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
    getReservation(reservation_id)
      .then((response) => {
        setForm({
          ...response,
          reservation_date: response.reservation_date.slice(
            0,
            response.reservation_date.indexOf("T")
          ),
        });
      })
      .catch(setError);
  }, [reservation_id, isEdit]);

  function handleChange(e, key) {
    setForm({ ...form, [key]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const abortController = new AbortController();
      setError(null);

      await updateReservation(
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
      <h1>Edit A Reservation</h1>
      <ErrorAlert error={error} />
      {form.status !== "booked" ? (
        <p>
          You can't edit this reservation. A reservation must be in the 'booked'
          status to edit.
        </p>
      ) : (
        <ReservationForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default EditReservation;
