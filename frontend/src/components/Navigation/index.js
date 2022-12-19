import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useHistory } from 'react-router-dom';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  // console.log("This is session user", sessionUser)

  const newSpotRouteRedirect = () => {
    history.push(`/spots/new`)
}

let checkUser = () => {
  alert("Please sign up or log in to add location.")
}

  return (
    <div className='navigation-bar'>
      <div className='left-nav-div'>
        <NavLink exact to="/"><i class="fa-solid fa-cloud-moon">AlphaBnB</i></NavLink>
      </div>
      {isLoaded && (
        <div className='right-nav-div'>
          {/* <button onClick={newSpotRouteRedirect} className="add-location">
                    Add Location
                </button> */}
          {(!sessionUser) ? <span id="add-spot-link" onClick={checkUser}>Alphabnb your home</span> : <NavLink to="/spots/new" id="add-spot-link" >Alphabnb your home</NavLink>}
          {/* <NavLink to="/spots/new" id="add-spot-link" >Alphabnb your home</NavLink> */}
          <ProfileButton user={sessionUser}/>
        </div>
      )}
    </div>
  );
}

export default Navigation;
