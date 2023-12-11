import React from "react";
import "../styles/about.css";

const About = () => {
    return (
        <div className="about-container">
          <div className="header">
            <h1>Thanks for visiting our Tour Management System site!</h1>
          </div>
          <div className="paragraphs">
            <div className="paragraph">
              <h2>Step 1</h2>
              <p>Visit our home page and search for the city you would like to travel to. Once you select a city, 
                you will be brought to an explore page for that place where you will find images as well as options
                to navigate to our hotel and transportation search pages.</p>
            </div>
            <div className="paragraph">
              <h2>Step 2</h2>
              <p>On our hotel search page, you will see a list of all available hotels in that city. You can search 
                the hotel result list by name as well as filter by price and stars. You will be able to select a hotel 
                result to view reviews and pricing. On our transportation search page, you will need to input a departure 
                city and will then see a list of all available modes of transportation between those two cities.</p>
            </div>
            <div className="paragraph">
              <h2>Step 3</h2>
              <p>Once you find your preferred accomodations and transportation, you can book and pay directly on our site! 
                Any bookings will appear on your itinerary on our "Tours" page. You can share your itinerary with other
                travelers in your group and make comments on the tour plan on this page.</p>
            </div>
          </div>
        </div>
      );
};

export default About;
