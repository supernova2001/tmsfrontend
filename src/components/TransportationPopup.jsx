import React, { useState, useEffect} from "react";
import PropTypes from "prop-types";
import "../styles/search-transportation.css"; 


const TransportationPopup = ({ onClose, onSubmit, selectedTransportation }) => {
  const [numTravelersPopup, setNumTravelersPopup] = useState(1);
  const [departureDatePopup, setDepartureDatePopup] = useState("");
  const [returnDatePopup, setReturnDatePopup] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");

  const handleNumTravelersChangePopup = (event) => {
    setNumTravelersPopup(event.target.value);
  };

  const handleDepartureDateChangePopup = (event) => {
    setDepartureDatePopup(event.target.value);
  };

  const handleReturnDateChangePopup = (event) => {
    setReturnDatePopup(event.target.value);
  };

  const handleCreditCardNumberChange = (event) => {
    setCreditCardNumber(event.target.value);
  }

  const handleExpirationDateChange = (event) => {
    setExpirationDate(event.target.value);
  }

  const handleCvvChange = (event) => {
    setCvv(event.target.value);
  }

  const handleEmailChanges = (event) => {
    setEmail(event.target.value);
  }

  const handleSubmit = () => {
    onSubmit({
      numTravelers: numTravelersPopup,
      departureDate: departureDatePopup,
      returnDate: returnDatePopup,
    });
    onClose();
  };
     
  return (
    <div className="popup">
      <div className="popup-inner">
        <br></br>
        <h2 class="transportation-title">Enter details: </h2>
        <label htmlFor="numTravelersPopup">Number of Travelers:</label>
        <input
          type="number"
          id="numTravelersPopup"
          value={numTravelersPopup}
          onChange={handleNumTravelersChangePopup}
        />
        <br></br>
        <label htmlFor="departureDatePopup">Departure Date:</label>
        <input
          type="date"
          id="departureDatePopup"
          value={departureDatePopup}
          onChange={handleDepartureDateChangePopup}
        />
        <br></br>
        <label htmlFor="returnDatePopup">Return Date:</label>
        <input
          type="date"
          id="returnDatePopup"
          value={returnDatePopup}
          onChange={handleReturnDateChangePopup}
        />
        <br></br>
        <label htmlFor="creditCardNumber">Credit Card Number:</label>
        <input
          type="text"
          id="creditCardNumber"
          value={creditCardNumber}
          onChange={handleCreditCardNumberChange}
          placeholder="XXXX-XXXX-XXXX-XXXX"
        />
        <br></br>
        <label htmlFor="expirationDate">Expiration Date:</label>
        <input
          type="text"
          id="expirationDate"
          value={expirationDate}
          onChange={handleExpirationDateChange}
          placeholder="MM/YY"
        />
        <br></br>
        <label htmlFor="cvv">CVV:</label>
        <input
          type="text"
          id="cvv"
          value={cvv}
          onChange={handleCvvChange}
          placeholder="XXX"
        />
        <br></br>
        <label htmlFor="cvv">Email:</label>
        <input
          type="email"
          id="useremail"
          value={email}
          onChange={handleEmailChanges}
          placeholder="Enter your Mail Id"
        />
    <button class="search-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

TransportationPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedTransportation: PropTypes.object.isRequired,
};

export default TransportationPopup;
