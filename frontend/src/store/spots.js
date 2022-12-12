const LOAD_SPOTS = "spots/LOAD_SPOTS";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";
const ADD_SPOT = "spots/ADD_SPOT";

const load = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

const update = (spot) => ({
  type: UPDATE_SPOT,
  spot
});

const add = (spot) => ({
  type: ADD_SPOT,
  spot
});

const remove = (spotId) => ({
  type: REMOVE_SPOT,
  spotId
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok){
        const acquiredSpots = await response.json();
        dispatch(load(acquiredSpots));
    }
};

export const updateSpot = (spot, spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spot)
    })

    if(response.ok){
        const updatedSpot = await response.json()
        dispatch(update(updatedSpot))
        return updatedSpot
    }
}

export const addSpot = (addedSpot, ownerId) => async dispatch => {
    const response = await fetch(`/api/spots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addedSpot)
    });

    if(response.ok){
      const newSpot = await response.json();
      dispatch(add(newSpot));
      return newSpot
    }
  }

  export const removeSpot = (spotId) => async dispatch =>{
    const response = await fetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
      if(response.ok){
        const deletedSpot = await response.json();
        dispatch(remove(spotId))
        return deletedSpot
      }
  }


const initialState = {spots: null};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case LOAD_SPOTS:
            const newSpots = {};
            action.spots.forEach(spot => {
                newSpots[spot.id] = spot;
            })
            return {
                ...state,
                ...newSpots
            };
        case REMOVE_SPOT:
            newState = {...state}
            delete newState[action.spotId];
            return newState;
        case ADD_SPOT:
            return {...state, [action.spot.spotId]: action.spot}
        case UPDATE_SPOT:
            return {...state, [action.spot.spotId]: action.spot}
            default:
                return state;
    }
}

export default spotsReducer
