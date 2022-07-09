import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewTables() {
  let history = useHistory();

  const initalForm = {
    table_name: "",
    capacity: "",
    table_status: 'free'
  };

  const [form, setForm] = useState({ ...initalForm });
  const [error, setError] = useState(null);

  function handleChange(e, key) {
    setForm({ ...form, [key]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable(
        { ...form, capacity: Number(form.capacity) },
        abortController.signal
      );
      history.push(`/dashboard`);
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
      <h1>Create A Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">
          Table Name:
          <input
            id="table_name"
            type="text"
            name="table_name"
            onChange={(e) => handleChange(e, "table_name")}
            value={form.table_name}
          />
        </label>
        <label htmlFor="capacity">
          Capacity:
          <input
            id="capacity"
            type="number"
            name="capacity"
            onChange={(e) => handleChange(e, "capacity")}
            value={form.capacity}
          />
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </>
  );
}

export default NewTables;
