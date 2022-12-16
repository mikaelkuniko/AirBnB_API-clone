import { NavLink } from "react-router-dom";

const ReviewCard = ({User, review, stars, Spot}) => {
    return (
        <div>
            <div>
                {!Spot ? <h4>{User.firstName} {User.lastName}</h4>: ''}
                {!!Spot ? <NavLink to={`/spots/${Spot.id}`}><h4>{Spot.name}</h4></NavLink> : ''}
            </div>
            <div>
                <p>{stars} stars</p>
                <p>{review}</p>
            </div>
        </div>
    );
  };

  export default ReviewCard;
