import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Route, Switch, NavLink } from 'react-router-dom';
import { getAllSpots } from '../../store/spots';
import SpotCard from '../SpotsCards'
import { useHistory } from 'react-router-dom';
// import SpotDetail from '../SpotDetails';

const SpotsList = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state=>state.spots.allSpots);
    const history = useHistory()
    // console.log('State obj', useSelector(state=>state))

    // console.log("this is spots", spots);

    const spotsArr = Object.values(spots)

    // console.log("This is spotsArr", spotsArr)

    useEffect(()=>{
        dispatch(getAllSpots());
    }, [dispatch]);

    const newSpotRouteRedirect = () => {
        history.push(`/spots/new`)
    }

    if (!spots) return null
    return (
        <div>
            <h1>Accomodations</h1>
            <ul>
                {spotsArr.map((spot)=>(
                    // <li key={id}><NavLink to={`/spots/${id}`}>{name}</NavLink></li>
                    <SpotCard key={spot.id} {...spot} />
                ))}
            </ul>
            <div>
                <button onClick={newSpotRouteRedirect}>
                    Add Location
                </button>
            </div>
        </div>

    )
}

export default SpotsList
