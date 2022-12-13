import { NavLink } from "react-router-dom";

const SpotCard = ({ id ,name, address, city, state, country, lat, lng, description, price, avgRating, previewImage }) => {
    return (
      <li className="spots-card">
        <NavLink to={`/spots/${id}`}>
        <h2>{name}</h2>
        <h3>{address}, {city}, {state} </h3>
        <p>${price} per night</p>
        <p>Rating:{avgRating}</p>
        </NavLink>
      </li>
    );
  };

  export default SpotCard;
