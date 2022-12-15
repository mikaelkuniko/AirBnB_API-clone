import { NavLink } from "react-router-dom";

const SpotCard = ({ id ,name, address, city, state, country, lat, lng, description, price, avgRating, previewImage }) => {
    return (
      <li className="spots-card">
        <NavLink to={`/spots/${id}`}>
        <h2>{name}</h2>
        <img src={previewImage} alt='spot image'/>
        <h3>{address}, {city}, {state} </h3>
        <p>${price} per night</p>
        <p>Rating:{avgRating ? avgRating : ' New Location'}</p>
        </NavLink>
      </li>
    );
  };

  export default SpotCard;
