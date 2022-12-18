import { NavLink } from "react-router-dom";
import './SpotsCards.css'

const SpotCard = ({ id ,name, address, city, state, country, lat, lng, description, price, avgRating, previewImage }) => {
    return (
      <div className="spot-card">
        <NavLink to={`/spots/${id}`}>
          <div className="image-container">
            <img src={previewImage} alt='spot image' id="spot-image"/>
          </div>
          <div className="spot-info-container">
            <div className="top-info-div">
            <h3>{city}, {state} </h3>
            <p><i class="fa-sharp fa-solid fa-star"/> {avgRating ? avgRating : ' New Location'}</p>
            </div>
            <span className='bottom-info-span'>
            <p id='price-text'>${price}</p><p id='night-text'>night</p>
            </span>
          </div>
        {/* <h2>{name}</h2> */}
        </NavLink>
      </div>
    );
  };

  export default SpotCard;
