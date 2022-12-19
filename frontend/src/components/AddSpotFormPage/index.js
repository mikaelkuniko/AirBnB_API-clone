import {useState, useEffect, useCallback} from 'react';
import {useDispatch} from "react-redux";
import { useModal } from '../../context/Modal';
import * as spotActions from '../../store/spots';
import { useHistory } from 'react-router-dom';
import './AddSpotForm.css'

const AddSpotForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    let spotObj = {address, city, state, country, lat, lng, name, description, price}
    let spotImageObj= {imageUrl, preview}

    // console.log("Spot object", spotObj)
    // console.log("SpotImage object", spotImageObj)
    let newSpotId;
    return dispatch(spotActions.addSpot(spotObj, spotImageObj))
        .then((res)=>newSpotId = res.id)
        .then(() => history.push(`/spots/${newSpotId}`))

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
        <div className='outer-div'>
          <div className='add-spot-div'>
        <h3 id='add-location-text'>Add Location</h3>
        <form onSubmit={handleSubmit} className='add-location-form'>
          <div className='add-location-inputs'>
            <p>Address</p>
        <label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder='Address'
            className='input'
          />
        </label>
        <p>City</p>
        <label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder='City'
            className='input'
          />
        </label>
        <p>State</p>
        <label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            placeholder='State'
            className='input'
          />
        </label>
        <p>Country</p>
        <label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder='Country'
            className='input'
          />
        </label>
        <p>Name</p>
        <label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Name'
            className='input'
          />
        </label>
        <p>Description</p>
        <label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder='Description'
            className='input'
          />
        </label>
        <p>Price per night</p>
        <label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder='Price per night'
            className='input'
          />
        </label>
        <p>Image URL</p>
        <label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder='Image URL'
            className='input'
          />
        </label>
        <p>Select to preview image</p>
        <div className='radio-buttons'>
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
      </div>
      </div>
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
        <button id='add-location-button' type="submit" className='alphabnb-button' disabled={!!errors.length}>Add location</button>
      </form>
      </div>
      </div>
    </>
      );
}

export default AddSpotForm
