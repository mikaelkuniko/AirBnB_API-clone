import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Route, Switch, NavLink } from 'react-router-dom';
import { getAllSpots } from '../../store/spots';
import SpotCard from '../SpotsCards'
import { useHistory } from 'react-router-dom';
// import SpotDetail from '../SpotDetails';
import './SpotsList.css'

const SpotsList = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state=>state.spots.allSpots);
    const history = useHistory()
    // console.log('State obj', useSelector(state=>state))
    const user = useSelector(state=>state.session)
    // console.log("Check user", user.user)
    // console.log("If checkuser is null should be false", !checkUser)
    // console.log("this is spots", spots);
    const buttonShow = (user.user ? "" : " hidden");
    // will not show button if no user log in

    const spotsArr = Object.values(spots)



    // console.log("This is spotsArr", spotsArr)

    useEffect(()=>{
        dispatch(getAllSpots());
    }, [dispatch]);

    // const newSpotRouteRedirect = () => {
    //     history.push(`/spots/new`)
    // }

    if (!spots) return null
    return (
        <div className='spots-lists'>
                {spotsArr.map((spot)=>(
                    // <li key={id}><NavLink to={`/spots/${id}`}>{name}</NavLink></li>
                    <SpotCard key={spot.id} {...spot} />
                ))}
            {/* <div>
                <button onClick={newSpotRouteRedirect} className={buttonShow}>
                    Add Location
                </button>
            </div> */}
        </div>

    )
}

export default SpotsList
