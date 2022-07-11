import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewTables from "../tables/NewTables";
import ReservationSeat from "../reservations/ReservationSeat";
import ReservationSearch from "../reservations/ReservationSearch";
import EditReservation from "../reservations/EditReservation";
import CreateReservation from "../reservations/CreateReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact path="/tables">
        <Dashboard date={today()}/>
      </Route>

      <Route path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>

      <Route exact path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>


      <Route path="/tables/new">
        <NewTables />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>

      <Route path="/search">
        <ReservationSearch />
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  );
}

export default Routes;
