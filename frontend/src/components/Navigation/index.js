import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useHistory } from 'react-router-dom';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  const newSpotRouteRedirect = () => {
    history.push(`/spots/new`)
}

  return (
    <div className='navigation-bar'>
      <div className='left-nav-div'>
        <NavLink exact to="/"><i class="fa-solid fa-cloud-moon"></i></NavLink>
      </div>
      {isLoaded && (
        <div className='right-nav-div'>
          <button onClick={newSpotRouteRedirect} className="add-location">
                    Add Location
                </button>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
