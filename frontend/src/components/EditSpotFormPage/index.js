import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useModal } from '../../context/Modal';
import * as spotActions from '../../store/spots';
import { useHistory, useParams } from 'react-router-dom';

const EditSpotForm = () => {

const dispatch = useDispatch();
const [address, setAddress] = useState('')
const [city, setCity] = useState('')
const [state, setState] = useState('')
const [country, setCountry] = useState('')
// lat/lng not functional currently
const [lat, setLat] = useState(0)
const [lng, setLng] = useState(0)
// lat/lng not functional currently
const [name, setName] = useState('')
const [description, setDescription] = useState('')
const [price, setPrice] = useState('')
const [imageUrl, setImageUrl] = useState('')
const [preview, setPreview] = useState(false)
const [errors, setErrors] = useState([]);
const { closeModal } = useModal();
const history = useHistory()
const {spotId} = useParams()

useEffect(()=> {
    //do the errors!!
    const errors = [];
    if(address.length === 0) errors.push("Address must be a valid address")
    if(city.length === 0) errors.push("City must be a valid city")
    if(state.length === 0) errors.push("State must be a valid state")
    if(country.length === 0) errors.push("Country must be a valid country")
    if(name.length === 0) errors.push("Name must be inputted")
    if(description.length === 0) errors.push("There must be a description")
    if(+price <= 0) errors.push("Price must be greater than 0")

    setErrors(errors);
  }, [address, city, state, country, lat, lng, name, description, price])

  useEffect(()=> {

  }, [errors])

  useEffect(()=>{
    dispatch(spotActions.getSingleSpot(spotId))
        .then((res)=>{
            // console.log('this is the response', res)
            setAddress(res.address)
            setCity(res.city)
            setState(res.state)
            setCountry(res.country)
            setName(res.name)
            setDescription(res.description)
            setPrice(res.price)
        })
  }, [dispatch])

  //grab owners and spot images from res
//   let uneditedSpot = {}
  const spot = useSelector((state)=>state.spots.singleSpot)
  console.log('This is edit spot slice', spot)

const handleSubmit = (e) => {
    e.preventDefault()
    let spotObj = {address, city, state, country, lat, lng, name, description, price}
    let ownerImageObj = {Owner: spot.Owner, SpotImages: spot.SpotImages, avgStarRating: spot.avgStarRating, numReviews: spot.numReviews}
    // let spotImageObj= {imageUrl, preview}

    // console.log("Spot object", spotObj)
    // console.log("SpotImage object", spotImageObj)
    // avgStarRating
    // numReviews

    return dispatch(spotActions.updateSpot(spotObj, spotId, ownerImageObj))
        .then(() => history.push(`/spots/${spotId}`))

    // try async
    // use await on dispatch on handlesubmit

    setAddress('')
    setCity('')
    setState('')
    setCountry('')
    setName('')
    setLat(0)
    setLng(0)
    setDescription('')
    setPrice('')
    setImageUrl('')
    setPreview(false)
}
    return (
        <>
        <h1>Edit Location</h1>
        <form onSubmit={handleSubmit}>
        {!!errors.length && (
        <div>
          The following errors were found:
          <ul className='errors'>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
        <label>
            Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
            City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        {/* <label>
          Image URL
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <label>
        <input
          type="radio"
          value={false}
          name="preview"
          onChange={(e)=>{setPreview(e.target.value)}}
          checked={preview == 'false'}
        />
        Don't preview image
      </label>
      <label>
        <input
          type="radio"
          value={true}
          name="preview"
          onChange={(e)=>{setPreview(e.target.value)}}
          checked={preview == 'true'}
        />
        Preview Image
      </label>
        <button type="submit">Add location</button> */}
        <button type="submit">Edit Location</button>
      </form>
    </>
      );
}

export default EditSpotForm