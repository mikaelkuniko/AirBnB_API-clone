const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOT"
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";
const ADD_SPOT = "spots/ADD_SPOT";

const load = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

const loadSingle = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot
})

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

export const getSingleSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`)

    if(response.ok){
        const foundSpot = await response.json();
        dispatch(loadSingle(foundSpot))
    }
}

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
    //   pseudo code
    //   const newImageResponse = await fetch(`/api/spots/${newSpot.id}/images`, {})
    //   if(newImageResponse.ok){
    //     const newImage = await newImageResponse.json(
    //     )
    //   }

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


const initialState = {
    allSpots:{},
    singleSpot: {}
};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case LOAD_SPOTS:
            // console.log("This is action.spots", action.spots)
            // console.log("This is action.spots.Spots", action.spots.Spots)
            newState = {...state};
            let newAllSpots = {}
            action.spots.Spots.forEach(spot => {
                newAllSpots[spot.id] = spot;
            })
            newState.allSpots = newAllSpots
            return newState;
        case LOAD_SINGLE_SPOT:
            newState = {...state};
            // pseudo code below
            let newSingleSpot = {}
            newSingleSpot = {[action.spot.id]: action.spot}
            newState.singleSpot = newSingleSpot
            return newState
        case REMOVE_SPOT:
            newState = {...state}
            delete newState.allSpots[action.spotId];
            return newState;
        case ADD_SPOT:
            newState = {...state}
            newState.allSpots = {...newState.allSpots, [action.spot.spotId]: action.spot}
            return newState
        case UPDATE_SPOT:
            newState = {...state}
            newState.allSpots = {...newState.allSpots, [action.spot.spotId]: action.spot}
            return newState
        default:
            return state;
    }
}

export default spotsReducer
