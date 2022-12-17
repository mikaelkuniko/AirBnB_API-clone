import { NavLink } from "react-router-dom";

const SpotCard = ({ id ,name, address, city, state, country, lat, lng, description, price, avgRating, previewImage }) => {
    return (
      <li className="spots-card">
        <NavLink to={`/spots/${id}`}>
        <img src={previewImage} alt='spot image'/>
        <h3>{city}, {state} </h3>
        <p>Rating:{avgRating ? avgRating : ' New Location'}</p>
        <p>${price} per night</p>
        {/* <h2>{name}</h2> */}
        </NavLink>
      </li>
    );
  };

  export default SpotCard;
