import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsList from "./components/SpotsList";
import SpotDetail from "./components/SpotDetails";
import AddSpotForm from "./components/AddSpotFormPage";
import EditSpotForm from "./components/EditSpotFormPage";
import UserReviews from "./components/UserReviews";
import AddReviewForm from "./components/AddReviewFormPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
          <SpotsList/>
          </Route>
          <Route exact path="/spots/new">
            <AddSpotForm/>
          </Route>
          <Route exact path="/spots/:spotId">
          <SpotDetail/>
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <EditSpotForm/>
          </Route>
          <Route exact path="/spots/:spotId/reviews/new">
            <AddReviewForm/>
          </Route>
          <Route exact path="/user/reviews">
            <UserReviews/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
