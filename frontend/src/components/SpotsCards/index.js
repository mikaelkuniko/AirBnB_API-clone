import { NavLink } from "react-router-dom";
import './SpotsCards.css'

const SpotCard = ({ id ,name, address, city, state, country, lat, lng, description, price, avgRating, previewImage }) => {
    return (
      <div className="spot-card">
        <NavLink to={`/spots/${id}`}>
        <img src={previewImage} alt='spot image' className="spot-image"/>
        <h3>{city}, {state} </h3>
        <p><i class="fa-sharp fa-solid fa-star"/> {avgRating ? avgRating : ' New Location'}</p>
        <p>${price} per night</p>
        {/* <h2>{name}</h2> */}
        </NavLink>
      </div>
    );
  };

  export default SpotCard;
