import React from "react";
import "./homePage.css";
import { Dropdown } from "react-bootstrap";
const HomePage = () => {
  return (
    <div>
      {/* HEADER */}
      <header className="header" data-header>
        <div className="container">
          <a href="#" className="logo">
            <img src="image1.jpeg" alt="Company's logo" />{" "}
            {/* COMPANY'S LOGO'S IMAGE LINK */}
          </a>
          <button className="menu-toggle-btn" data-nav-toggle-btn>
            <ion-icon name="menu-outline"></ion-icon>
          </button>
          <nav className="navbar">
            <ul className="navbar-list">
              <li>
                <a href="#home" className="navbar-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#popular" className="navbar-link">
                  Popular Plans
                </a>
              </li>
              <li>
                <a href="#plans" className="navbar-link">
                  Plans
                </a>
              </li>
              <li>
                <a href="#review" className="navbar-link">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="navbar-link">
                  Contact Us
                </a>
              </li>
            </ul>
            <div className="header-actions">
            <Dropdown className="d-inline-block">
        <Dropdown.Toggle variant="link" id="login-dropdown" className="header-action-link">
          Log in
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/login?role=Customer">Login as Customer</Dropdown.Item>
          <Dropdown.Item href="/login?role=Agent">Login as Agent</Dropdown.Item>
          <Dropdown.Item href="/login?role=Employee">Login as Employee</Dropdown.Item>
          <Dropdown.Item href="/login?role=Admin">Login as Admin</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
              <a href="#" className="header-action-link">
                Register
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <article>
          {/* HOME SECTION */}
          <section className="home" id="home">
            <div className="container">
              <div className="home-content">
                <h1 className="h1 home-title">FORTUNE LIFE</h1>
                <p className="home-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <p className="form-text">
                  <span role="img" aria-label="party emoji">
                    🥳
                  </span>{" "}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <form action="" className="home-form">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter Your Email"
                    className="email-field"
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>
              </div>
              <figure className="home-banner">
                <img src="image.jpeg" alt="Image" /> {/* IMAGE LINK */}
              </figure>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section className="about">
            <div className="container">
              <div className="about-content">
                <div className="about-icon">
                  <ion-icon name="star"></ion-icon>
                </div>
                <h2 className="h2 about-title">Why Choose Us?</h2>
                <p className="about-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <button className="btn btn-outline">Learn More</button>
              </div>
              <ul className="about-list">
                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="thumbs-up"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">Easy</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="happy"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">Reliable</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="shield-checkmark"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">Security</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="server"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">Data Privacy</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* POPULAR PLANS SECTION */}
          <section className="popular" id="popular">
            <div className="container">
              <h2 className="h2 section-title">Our Most Popular Plans</h2>
              <p className="section-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="popular-wrapper">
                <figure className="popular-banner">
                  <img src="image.jpeg" alt="Inserted Image1" />{" "}
                  {/* IMAGE ONE LINK */}
                </figure>
                <div className="popular-content">
                  <p className="popular-content-subtitle">
                    <ion-icon name="sparkles"></ion-icon>
                    <span>
                      <strong>FAMILY HEALTH INSURANCE</strong>
                    </span>
                  </p>
                  <h3 className="popular-content-title">
                    Built specially for your health and loved ones
                  </h3>
                  <p className="popular-content-text">
                    Temporibus autem quibusdam et aut officiis debitis aut rerum
                    a necessitatibus saepe eveniet ut et voluptates repudiandae
                    sint molestiae non recusandae itaque.
                  </p>
                  <ul className="popular-list">
                    <li className="popular-list-item">
                      <ion-icon name="layers-outline"></ion-icon>
                      <p>Donec pede justo fringilla vel nec.</p>
                    </li>
                    <li className="popular-list-item">
                      <ion-icon name="megaphone-outline"></ion-icon>
                      <p>Cras ultricies mi eu turpis hendrerit fringilla.</p>
                    </li>
                  </ul>
                  <div className="btn-group">
                    <button className="btn btn-primary">Read More</button>
                    <button className="btn btn-secondary">Buy Now</button>
                  </div>
                </div>
              </div>
              <div className="popular-wrapper">
                <figure className="popular-banner">
                  <img src="image.jpeg" alt="Inserted Image2" />{" "}
                  {/* IMAGE TWO LINK */}
                </figure>
                <div className="popular-content">
                  <p className="popular-content-subtitle">
                    <ion-icon name="sparkles"></ion-icon>
                    <span>
                      <strong>CRITICAL ILLNESS HEALTH INSURANCE</strong>
                    </span>
                  </p>
                  <h3 className="popular-content-title">
                    We take care of you so you can stay focused on your work and
                    family.
                  </h3>
                  <p className="popular-content-text">
                    Temporibus autem quibusdam et aut officiis debitis aut rerum
                    a necessitatibus saepe eveniet ut et voluptates repudiandae
                    sint molestiae non recusandae itaque.
                  </p>
                  <ul className="popular-list">
                    <li className="popular-list-item">
                      <ion-icon name="rocket-outline"></ion-icon>
                      <p>Donec pede justo fringilla vel nec.</p>
                    </li>
                    <li className="popular-list-item">
                      <ion-icon name="wifi-outline"></ion-icon>
                      <p>Cras ultricies mi eu turpis hendrerit fringilla.</p>
                    </li>
                  </ul>
                  <div className="btn-group">
                    <button className="btn btn-primary">Read More</button>
                    <button className="btn btn-secondary">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PLANS SECTION */}
          <section className="plans" id="plans">
            <div className="container">
              <div className="plans-content">
                <div className="plans-icon">
                  <ion-icon name="pulse"></ion-icon>
                </div>
                <h2 className="h2 plans-title">
                  Types of Insurances We Provide
                </h2>
                <p className="plans-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <ul className="plans-list">
                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="man"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">
                      Individual Health Insurance
                    </h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="people"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">Family Health Insurance</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="walk"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">
                      Senior Citizen Health Insurance
                    </h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="heart"></ion-icon>
                    </div>
                    <h3 className="h3 card-title">
                      Critical Illness Health Insurance
                    </h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* CUSTOMER REVIEWS SECTION */}
          <section className="review" id="review">
            <div className="container">
              <h2 className="h2 section-title">Customer Reviews</h2>
              <p className="section-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <ul className="review-list has-scrollbar">
                <li>
                  <div className="review-card">
                    <div className="review-card-content">
                      <div className="review-ratings">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>
                      <p className="review-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Explicabo, minima. Magni, odio eos ipsa consequatur
                        fugit voluptatum tenetur aliquam velit?
                      </p>
                      <div className="review-content-footer">
                        <div className="review-user">
                          <img src="review.jpg" alt="User Photo" />
                          <h3 className="h3 review-user-name">John Doe</h3>
                        </div>
                        <p className="review-date">15 March 2023</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="review-card">
                    <div className="review-card-content">
                      <div className="review-ratings">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>
                      <p className="review-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Explicabo, minima. Magni, odio eos ipsa consequatur
                        fugit voluptatum tenetur aliquam velit?
                      </p>
                      <div className="review-content-footer">
                        <div className="review-user">
                          <img src="review.jpg" alt="User Photo" />
                          <h3 className="h3 review-user-name">Jane Doe</h3>
                        </div>
                        <p className="review-date">18 April 2023</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="review-card">
                    <div className="review-card-content">
                      <div className="review-ratings">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>
                      <p className="review-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Explicabo, minima. Magni, odio eos ipsa consequatur
                        fugit voluptatum tenetur aliquam velit?
                      </p>
                      <div className="review-content-footer">
                        <div className="review-user">
                          <img src="review.jpg" alt="User Photo" />
                          <h3 className="h3 review-user-name">John Smith</h3>
                        </div>
                        <p className="review-date">5 June 2023</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* CONTACT US SECTION */}
          <section className="contact" id="contact">
            <div className="container">
              <h2 className="h2 section-title">Contact Us</h2>
              <p className="section-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="contact-wrapper">
                <div className="contact-banner">
                  <img src="image.jpeg" alt="Image" />{" "}
                  {/* CONTACT IMAGE LINK */}
                </div>
                <form action="" className="contact-form">
                  <div className="form-wrapper">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Full Name"
                        className="input-field"
                      />
                      <ion-icon name="person"></ion-icon>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email Address"
                        className="input-field"
                      />
                      <ion-icon name="mail"></ion-icon>
                    </div>
                  </div>
                  <textarea
                    name="message"
                    placeholder="Write your message..."
                    className="input-field"
                  ></textarea>
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-wrapper">
            <div className="footer-content">
              <div className="footer-icon">
                <ion-icon name="heart"></ion-icon>
              </div>
              <h2 className="h2 footer-title">
                Insurance Policy Is a Necessity, Not a Choice.
              </h2>
              <p className="footer-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <a href="#home" className="btn btn-secondary">
                Go to Top
              </a>
            </div>
            <ul className="footer-list">
              <li>
                <a href="#home" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#popular" className="footer-link">
                  Popular Plans
                </a>
              </li>
              <li>
                <a href="#plans" className="footer-link">
                  Plans
                </a>
              </li>
              <li>
                <a href="#review" className="footer-link">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <p className="footer-copyright">
            &copy; 2024 Fortune Life. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
