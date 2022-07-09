import React, { useState } from "react";
import { deleteTableReservation, updateResStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableInfo({ table, loadDashboard }) {
  const [currentTable, setCurrentTable] = useState(table);
  const [error, setError] = useState(null);

  async function clearAndLoadTables() {
    const abortController = new AbortController();
    try {
      const response = await deleteTableReservation(currentTable.table_id, abortController.signal);
      const tableToSet = response.find((table) => table.table_id === currentTable.table_id);
      setCurrentTable({...tableToSet})
      return tableToSet;
    } catch (error) {
      setError(error);
    }
  }

  async function handleClear(event) {
    const abortController = new AbortController();
    event.preventDefault();
    setError(null);
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      await updateResStatus({ status: "finished"}, currentTable.reservation_id, abortController.signal);
      const newTable = await clearAndLoadTables();
      loadDashboard();
      console.log(newTable);
      return;
    }
    else{
      return
    }
     
  }

  return (
    <>
    <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {currentTable.table_id} </th>
        <td> {currentTable.table_name} </td>
        <td> {currentTable.capacity} </td>
        <td> {currentTable.reservation_id} </td>
        <td data-table-id-status={`${table.table_id}`}> {currentTable.table_status} </td>
        <td >
          {currentTable.reservation_id ?
          <button
          className="btn btn-danger"
          onClick={handleClear}
          data-table-id-finish={`${table.table_id}`}
          > 
          Finish 
          </button>
          : 
          <></>
          }
        </td>
      </tr>
    </>
  );
}

export default TableInfo;