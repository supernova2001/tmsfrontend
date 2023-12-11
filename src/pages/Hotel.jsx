import React, { useState, useEffect, useContext } from 'react';
import { AuthContext }  from '../components/Auth/AuthContext';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/hotel.css";  
import loginimage from "../assets/images/loginimage.png";
import { Button } from "reactstrap";

const defaultHotel = {
    _id: "654d49d477ef13fb0cb2ffd5",
    hotel_name: "Golden Gate Lodge",
    country: "USA",
    state: "California",
    city: "San Francisco",
    address: "123 Golden Gate Way",
    zipcode: "94102",
    info: "Golden Gate Lodge offers stunning views of the iconic Golden Gate Bridge. Guests can enjoy a range of activities including cycling, hiking, and sightseeing tours. The lodge is also close to several popular attractions such as Fisherman's Wharf and Alcatraz Island. With its spacious rooms and top-notch amenities, Golden Gate Lodge ensures a comfortable and memorable stay.", // Description of the place such as activities 
    price: 150,
    stars: 4,
    reviewIds: [],
    images: [] // Placeholder for image paths
};
//Place holder review data structure
const exampleReview = {
    _id: "123456789",
    reviewDescription: "Loading...",
    rating: 5
};

const Hotel = () => {
    const [hotel, setHotel] = useState(defaultHotel);
    const [reviews, setReviews] = useState([]);

    const [loggedIn, setLoggedIn] = useState(true); 
    const [userID, setUserID] = useState(null);
    const { user, dispatch } = useContext(AuthContext);

    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);

    const [showBookingOptions, setShowBookingOptions] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [numberOfTravelers, setNumberOfTravelers] = useState(1);

    const location = useLocation();
    const navigate = useNavigate();

    const getQueryParam = (param) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(param);
    };

    useEffect(() => {
        const hotelId = getQueryParam("hotelname");
        if (hotelId) {
            fetchHotelData(hotelId);
        }
    }, [location]);

    const fetchHotelData = async (hotelId) => {
        try {
            const response = await fetch(`https://tmsbcknd.onrender.com/get-accommodation-by-id/id?accommodationId=${hotelId}`);
            if (response.status === 200) {
                const data = await response.json();
                console.log("Fetched Hotel Data:", data); // Log the hotel data
    
                // Check if data is an array and not empty, then use the first element
                if (Array.isArray(data) && data.length > 0) {
                    setHotel(data[0]);
                    setReviews(data[0].reviews || []);
                    setReviews(data[0].reviews.filter(review => review && review.trim().length > 0)); 
                } else {
                    console.error("Received data is not an array or is empty");
                    setHotel(defaultHotel);
                }
            } else {
                console.error("Failed to fetch hotel data");
                setHotel(defaultHotel);
            }
        } catch (error) {
            console.error("Error fetching hotel data:", error);
            setHotel(defaultHotel);
        }
    };

        /*      
    useEffect(() => {
        setUserID('650f3243888370a46685cf38');
        setLoggedIn(true);
      }, []);
 */
    useEffect(() => {
    if (user) {
      setLoggedIn(true);
      setUserID(user._id); 
    } else {
      setLoggedIn(false);
      setUserID(null);
    }
  }, [user]);

      const handleBookingClick = () => {
        if (!loggedIn) {
            // Navigate to login page if not logged in
            navigate('/login');
        } else {
            setShowBookingOptions(true);
        }
    };

    const handleConfirmBooking = async () => {
        if (!startDate || !endDate) {
            alert("Please select valid dates.");
            return;
        }
    
        // Ensure userID is available
        if (!userID) {
            alert("User ID is not available. Please log in.");
            return;
        }
    
        // Prepare booking data
        const bookingData = {
            uid_user: userID,
            uid_accomodation: hotel._id,
            checkin_date: startDate,
            checkout_date: endDate,
            num_travelers: numberOfTravelers
        };
    
        try {
            const response = await fetch(`https://tmsbcknd.onrender.com/add-accomodationitinerary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
    
            if (response.status === 201) {
                alert("Booking confirmed!");
                setShowBookingOptions(false); 
            } else {
                alert("Error in booking. Please try again.");
            }
        } catch (error) {
            console.error("Error while booking:", error);
            alert("Error in booking. Please try again.");
        }
    };

    const calculatePrice = () => {
        if (!startDate || !endDate) {
            return null;
        }
        const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        return days > 0 ? days * hotel.price * numberOfTravelers : null;
    };

    const handleReviewSubmit = async () => {
        if (!reviewText.trim()) {
            alert("Please provide a review text.");
            return;
        }
        if (reviewRating === 0) {
            alert("Please select a rating.");
            return;
        }
    
        const reviewData = {
            accommodation_id: hotel._id,
            review: reviewText,
            rating: reviewRating
        };
    
        try {
            const response = await fetch('https://tmsbcknd.onrender.com/add-accommodation-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
    
            if (response.status === 200) {
                alert("Review submitted successfully!");
                setReviewText('');
                setReviewRating(0);
                
                fetchHotelData(hotel._id);
            } else {
                alert("Failed to submit the review. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error in submitting review. Please try again.");
        }
    };



    return (
        <section className="hotel-container">
            <h2 class="hotelName">{hotel.name}</h2>
    
            <div className="hotel-image">
                {(!hotel.images || hotel.images.length === 0) ? (
                    <img src={loginimage} alt="Default" />
                ) : (
                    hotel.images.map((img, index) => <img key={index} src={img} alt="" />)
                )}
            </div>
    
            <div className="hotel-details description">
                <h3 style={{ color: 'aliceblue' }}>Description</h3>
                <p style={{ color: 'aliceblue' }}><strong>Name: {hotel.name}</strong></p>
                <p style={{ color: 'aliceblue' }}><strong>Stars: {hotel.stars}</strong></p>
                <p style={{ color: 'aliceblue' }}><strong>Info: {hotel.info}</strong></p>
            </div>
    
            <div className="hotel-details address">
                <h3 style={{ color: 'aliceblue' }}>Address</h3>
                <p style={{ color: 'aliceblue' }}><strong>Country: {hotel.country}</strong></p>
                <p style={{ color: 'aliceblue' }}><strong>State: {hotel.state}</strong></p>
                <p style={{ color: 'aliceblue' }}><strong>City: {hotel.city}</strong></p>
                <p style={{ color: 'aliceblue' }}><strong>Address: {hotel.address}, {hotel.zipcode}</strong></p>
    
                <Button 
                    className="btn secondary__btn auth__btn" 
                    onClick={handleBookingClick}
                    style={{ display: showBookingOptions ? 'none' : 'block' }} 
                >
                    Book Now
                </Button>
                
                {showBookingOptions && (
                    <div className="booking-options">
                        <h3 style={{ color: 'aliceblue' }}>Booking Details:</h3>
                        <label style={{ color: 'aliceblue' }}>Start Date:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label style={{ color: 'aliceblue' }}>End Date:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <label style={{ color: 'aliceblue' }}>Number of Travelers:</label>
                        <input type="number" value={numberOfTravelers} onChange={(e) => setNumberOfTravelers(Number(e.target.value))} min="1" />
                        {calculatePrice() !== null ? (
                            <p style={{ color: 'aliceblue' }}>Total Price: ${calculatePrice()}</p>
                        ) : (
                            <p style={{ color: 'aliceblue' }}>Please select a valid date range</p>
                        )}
                        <Button onClick={handleConfirmBooking}>Confirm</Button>
                    </div>
                )}
            </div>
    
            <div className="hotel-details reviews">
                <h3 style={{ color: 'aliceblue' }}>Reviews</h3>
        {loggedIn && (
        <div className="review-submission">
            <div className="rating-block">
                <select
                    id="reviewRating"
                    className="review-dropdown"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    style={{ color: 'aliceblue' }}
                >
                    <option value="0">Select a rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
            </div>

            <div className="review-block">
                <textarea
                    id="reviewText"
                    className="review-textarea"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    style={{ color: 'aliceblue' }}
                />
            </div>

            <Button onClick={handleReviewSubmit} className="btn secondary__btn auth__btn review-submit-btn">
                Submit Review
            </Button>
        </div>)}
                {
                    reviews.map((review, index) => (
                        <div key={index} style={{ color: 'aliceblue' }}>
                            <p>{review}</p>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};

export default Hotel;