import {useState, useEffect, useCallback} from 'react';
import {useDispatch} from "react-redux";
import { useModal } from '../../context/Modal';
import * as spotActions from '../../store/spots';
import { useHistory } from 'react-router-dom';

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

    return dispatch(spotActions.addSpot(spotObj, spotImageObj))
        .then(() => history.push('/'))

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
        <h1>Add Location</h1>
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
            placeholder='Address'
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder='City'
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            placeholder='State'
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder='Country'
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Name'
          />
        </label>
        <label>
          Description
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder='Description'
          />
        </label>
        <label>
          Price per night
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder='Price per night'
          />
        </label>
        <label>
          Image URL
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder='Image URL'
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
        <button type="submit">Add location</button>
      </form>
    </>
      );
}

export default AddSpotForm
