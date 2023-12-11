import React, { useRef, useEffect, useState, useContext } from 'react';
import { AuthContext }  from '../components/Auth/AuthContext';
import 'ol/ol.css';
import "../styles/itinerary.css";
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import mapmarker from "../assets/images/mapmarker.png";

const Itinerary = () => {
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);
  const [hotelData, setHotelData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const [commentUpdateKey, setCommentUpdateKey] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userID, setUserID] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
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


  const fetchHotelData = async (hotelId) => {
    try {
        const response = await fetch(`https://tmsbcknd.onrender.com/get-accommodation-by-id/id?accommodationId=${hotelId}`);
        if (response.status === 200) {
            const data = await response.json();
            // Check if data is an array and not empty, then use the first element
            return Array.isArray(data) && data.length > 0 ? data[0] : null;
        } else {
            console.error("Failed to fetch hotel data for ID:", hotelId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching hotel data:", error);
        return null;
    }
};

const fetchItineraryData = async () => {
    if (loggedIn && userID) {
        try {
            const response = await fetch(`https://tmsbcknd.onrender.com/fetch-useritinerary/getUserItinerary?userId=${userID}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch itinerary data');
            }
            const itineraryData = await response.json();
            console.log("Fetched itinerary data:", itineraryData ); // Log the fetched data
            const accommodationPromises = itineraryData.accomodation.map(async (item) => {
                const hotelDetails = await fetchHotelData(item.uid_accomodation);
                return hotelDetails ? {
                    ...hotelDetails,
                    startDate: item.checkin_date,
                    endDate: item.checkout_date
                } : null;
            });

            const accommodations = await Promise.all(accommodationPromises);
            setHotelData(accommodations.filter(hotel => hotel != null && hotel.longtitude && hotel.latitude));
            setTransportData(itineraryData.travel);
            setComments(itineraryData.comments || []);
            console.log("Fetched comments:", itineraryData.comments);
        } catch (error) {
            console.error("Error fetching itinerary:", error);
        }
    }
};

useEffect(() => {
    fetchItineraryData();
}, [userID, loggedIn]);

  useEffect(() => {
    console.log("Updated hotel data:", hotelData); // Log the updated hotel data
    console.log("Updated transport data:", transportData); // Log the updated transport data
  }, [hotelData, transportData]);

  const postComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }
  
    const commentData = {
      uid_user: userID,
      comment: newComment
    };
  
    try {
      const response = await fetch('https://tmsbcknd.onrender.com/add-comment-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
  
      if (response.ok) {
        alert("Comment added successfully!");
        setNewComment("");
        // Reload comments or update state to show the new comment
        loadComments();
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Error in posting comment. Please try again.");
    }
  };

  const loadComments = async () => {
    await fetchItineraryData(); 

  };

  const handleEmailItinerary = async () => {
    if (!userID) {
      alert("User ID is not available.");
      return;
    }

    try {
      const response = await fetch('https://tmsbcknd.onrender.com/api/sendItineraryEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid_user: userID })
      });

      if (response.ok) {
        alert("Itinerary email sent successfully!");
      } else {
        throw new Error('Failed to send itinerary email');
      }
    } catch (error) {
      console.error("Error sending itinerary email:", error);
      alert("Error in sending itinerary email. Please try again.");
    }
  };

  const handleShareItinerary = async () => {
    if (!recipientEmail) {
      alert("Please enter a recipient email address.");
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(recipientEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('https://tmsbcknd.onrender.com/api/sendItineraryEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid_user: userID, recipientEmail })
      });

      if (response.ok) {
        alert("Itinerary email sent successfully!");
      } else {
        throw new Error('Failed to send itinerary email');
      }
    } catch (error) {
      console.error("Error sending itinerary email:", error);
      alert("Error in sending itinerary email. Please try again.");
    }
  };

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() })
      ],
      view: new View({
        center: fromLonLat([-86.1581, 39.7684]), // default coordinates
        zoom: 6
      })
    });
    setMapInstance(map);
  
    return () => map.setTarget(undefined);
  }, []);


  const updateMapMarkers = () => {
    if (mapInstance) {

      mapInstance.getLayers().getArray()
        .filter(layer => layer instanceof VectorLayer)
        .forEach(layer => mapInstance.removeLayer(layer));
  

      console.log('Hotel Data:', hotelData);
  

      const features = hotelData.map(hotel => {
        console.log(`Creating marker for ${hotel.name} at [${hotel.longtitude}, ${hotel.latitude}]`);
        const feature = new Feature({
          geometry: new Point(fromLonLat([hotel.longtitude, hotel.latitude]))
        });
        feature.setStyle(new Style({
          image: new Icon({ src: mapmarker, scale: 0.1 })
        }));
        return feature;
      });
  
      if (features.length > 0) {
        const vectorSource = new VectorSource({ features });
        const vectorLayer = new VectorLayer({ source: vectorSource });
        mapInstance.addLayer(vectorLayer);
      } else {
        console.log("No valid hotel data found for markers");
      }
    }
  };
  
  useEffect(() => {
    updateMapMarkers();
  }, [hotelData]);
  
  const handleHotelClick = (longtitude, latitude) => {
    if (mapInstance) {
      const view = mapInstance.getView();
      if (view) {
        view.animate({
          center: fromLonLat([longtitude, latitude]),
          zoom: 10
        });
      }
    }
  };

  useEffect(() => {
    const fetchItineraryData = async () => {
        if (loggedIn) {
          try {
            const response = await fetch(`https://tmsbcknd.onrender.com/fetch-useritinerary?userId=${userID}`);
            if (response.status !== 200) throw new Error('Failed to fetch itinerary data');
            const data = await response.json();
            setHotelData(data.accomodation);
            setTransportData(data.travel);
          } catch (error) {
            console.error("Error fetching itinerary:", error);
          }
        }
      };
  }, [loggedIn]);

  useEffect(() => {
    if (mapInstance) {
        mapInstance.updateSize();
    }
  }, [mapInstance]);


  return (
    <div className="itinerary-container">
      {loggedIn ? (
      <div className="info-section">
        {/* Hotels Section */}
        <div className="hotels-section">
  <div className="section-header"><strong>Hotels</strong></div>
  {loggedIn && hotelData.map((hotel, idx) => (
    <div key={idx} className="item-box" onClick={() => handleHotelClick(hotel.longtitude, hotel.latitude)}>
      <p><strong>{hotel.name}</strong></p>
      <p>Reservation: {hotel.startDate} - {hotel.endDate}</p>
      <p>Location: {hotel.city}, {hotel.state}</p>
      <p>Price: ${hotel.price} / night</p>
    </div>
  ))}
</div>

        {/* Transportation Section */}
      <div className="transport-section">
        <div className="section-header"><strong>Transportation</strong></div>
        {loggedIn && transportData.map((transport, idx) => (
          <div key={idx} className="item-box">
            <p><strong>Service: </strong></p>
            <p>Departure Date: {transport.departure_date}</p>
            <p>Return Date: {transport.return_date}</p>
            <p>Origin: {transport.from_place}</p>
            <p>Number of Travelers: {transport.num_travelers}</p>
          </div>
        ))}
      </div>

        {/* Comments Section */}
      <div className="comments-section">
        <div className="section-header"><strong>Comments</strong></div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment here..."
        />
        <button onClick={postComment}>Submit Comment</button>
        <button onClick={loadComments}>Load Comments</button>
        <button onClick={handleEmailItinerary}>Email Itinerary</button> 
        <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Recipient's Email"
            />
            <button onClick={handleShareItinerary}>Share Itinerary</button>
        <div className="comment-list" key={commentUpdateKey}>
          {comments.filter(comment => comment.trim().length > 0).map((comment, index) => (
            <div key={index} className="comment-item">
              <p>{comment}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
      ) : (
        <div className="info-section">
          <p><strong>Please log in to view the itinerary locations.</strong></p>
        </div>
      )}
      <div className="map-section">
        <div ref={mapRef} className="map-container"></div>
      </div>

    </div>
  );
};

export default Itinerary;