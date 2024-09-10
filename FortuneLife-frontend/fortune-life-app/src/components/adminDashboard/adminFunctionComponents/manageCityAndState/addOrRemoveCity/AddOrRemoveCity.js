import React, { useEffect, useState } from "react";
import { addCityToAState, addSchemeToACity, getAllStates, removeSchemeFromACity } from "../../../../../services/stateAndCityService"; // Verify the import path
import { errorToast, successToast, warnToast } from "../../../../../utils/Toast"; // Verify the import path
import { Button, Form, Container } from "react-bootstrap"; // Ensure Bootstrap is installed

const AddOrRemoveCity = ({ scheme, onClose ,flag,setFlag,remove}) => {
  const [allStates, setAllStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [pincode, setPincode] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const state = allStates.find(
        (state) => state.id === parseInt(selectedState, 10)
      );
      setCities(state ? state.cities || [] : []);
    } else {
      setCities([]);
    }
  }, [selectedState, allStates]);

  const fetchStates = async () => {
    try {
      const response = await getAllStates();
      if (response) {
        setAllStates(response);
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Failed to fetch states");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await addSchemeToACity(scheme, selectedCity);
      if (response) {
        successToast("Scheme Added.");
        setAddingCity(false); 
        setCityName(""); 
        setPincode("");
        setFlag(!flag)
        onClose(); // Close the modal or perform any action
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred while adding the scheme");
    }
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    setSelectedCity(""); // Reset selected city
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleAddCity = async () => {
    try {
      const response = await addCityToAState(selectedState, pincode, cityName);
      if (response) {
        successToast("City Added.");
        fetchStates(); 
        setAddingCity(false); 
        setCityName(""); 
        setPincode("");
        setFlag(!flag)
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred while adding the city");
    }
  };
  const handleRemove = async () => {
    try {
      const response = await removeSchemeFromACity(scheme, pincode);
      if (response) {
        warnToast("City Removed.");
       
        setAddingCity(false); 
        setCityName(""); 
        setPincode(""); 
        setFlag(!flag)
        onClose()
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred while adding the city");
    }
  };

  return (
    remove==false?
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="p-4 border rounded shadow-sm"
        style={{ maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4">Add City to Scheme</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="state">
            <Form.Label>Select State</Form.Label>
            <Form.Control
              as="select"
              value={selectedState}
              onChange={handleStateChange}
              required
            >
              <option value="">Select a state</option>
              {allStates.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {!addingCity && (
            <Form.Group controlId="city">
              <Form.Label>Select City</Form.Label>
              <Form.Control
                as="select"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedState}
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.pincode} value={city.pincode}>
                    {city.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          {addingCity && (
            <>
              <Form.Group controlId="cityName" className="mt-3">
                <Form.Label>City Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city name"
                  value={cityName}
                  required
                  onChange={(e) => setCityName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="pincode" className="mt-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}

          <div className="text-center mt-4">
            {!addingCity && (
              <Button variant="success" className="text-center me-2" type="submit">
                Add Scheme
              </Button>
            )}
            {!addingCity && (
              <Button variant="secondary" onClick={() => setAddingCity(true)}>
                Add City
              </Button>
            )}
            {addingCity && (
              <Button variant="success" className="text-center me-2" onClick={handleAddCity}>
                Add
              </Button>
            )}
            {addingCity && (
              <Button variant="secondary" onClick={() => setAddingCity(false)}>
                Back
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Container>:(<> <Form.Group controlId="pincode" className="mt-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
                <Button variant="danger" onClick={handleRemove}>
                Remove
              </Button>
              </Form.Group></>) 
  );
};

export default AddOrRemoveCity;
