import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Route, Switch, NavLink } from 'react-router-dom';
import { getAllSpots } from '../../store/spots';
import SpotCard from '../SpotsCards'
// import SpotDetail from '../SpotDetails';

const SpotsList = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state=>state.spots.allSpots);

    // console.log('State obj', useSelector(state=>state))

    // console.log("this is spots", spots);

    const spotsArr = Object.values(spots)

    // console.log("This is spotsArr", spotsArr)

    useEffect(()=>{
        dispatch(getAllSpots());
    }, [dispatch]);


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
        </div>

    )
}

export default SpotsList
