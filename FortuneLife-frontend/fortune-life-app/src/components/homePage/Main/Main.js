import React from "react";
import family2 from "../../../images/undraw_family_vg76.svg";
import "./Main.module.css";
import family from "../../../images/undraw_play_time_-7-k7b.svg";
import hospital from "../../../images/undraw_medical_care_movn.svg";
import maleAvatar from "../../../images/undraw_male_avatar_g98d.svg";
import femaleAvatar from "../../../images/undraw_female_avatar_efig.svg";

const Main = () => {
  return (
    <>
      <main>
        <article>
          <section className="home" id="home">
            <div className="container">
              <div className="home-content">
                <h1 className="h1 home-title">FORTUNE LIFE</h1>

                <p className="home-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.2</p>

                <p className="form-text">
                  <span>🥳</span> Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                <form action="" className="home-form">
                  <input type="email" name="email" required placeholder="Enter Your Email" className="email-field" />

                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>
              </div>

              <figure className="home-banner">
                <img src={family2} alt="home banner" />
              </figure>
            </div>
          </section>

          <section className="about">
            <div className="container">
              <div className="about-content">
                <div className="about-icon">
                  <ion-icon name="star"></ion-icon>
                </div>

                <h2 className="h2 about-title">Why Choose Us ?</h2>

                <p className="about-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                <button className="btn btn-outline">Learn More</button>
              </div>

              <ul className="about-list">
                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="thumbs-up"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Easy</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>

                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="happy"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Reliable</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>

                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="shield-checkmark"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Security</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>

                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="server"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Data Privacy</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="popular" id="popular">
            <div className="container">
              <h2 className="h2 section-title">Our Most Popular Plans</h2>

              <p className="section-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

              <div className="popular-wrapper">
                <figure className="popular-banner">
                  <img src={family} alt="Family" style={{ width: "80%" }} />
                </figure>

                <div className="popular-content">
                  <p className="popular-content-subtitle">
                    <ion-icon name="sparkles"></ion-icon>

                    <span>
                      <strong>FAMILY HEALTH INSURANCE</strong>
                    </span>
                  </p>

                  <h3 className="popular-content-title">
                    Build <strong>specially</strong> for <strong>your</strong> health <strong>and loved ones</strong>
                  </h3>

                  <p className="popular-content-text">Temporibus autem quibusdam et aut officiis debitis aut rerum a necessitatibus saepe eveniet ut et voluptates repudiandae sint molestiae non recusandae itaque.</p>

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
                  <img src={hospital} alt="Hosptalized" style={{ width: "80%" }} />
                </figure>

                <div className="popular-content">
                  <p className="popular-content-subtitle">
                    <ion-icon name="sparkles"></ion-icon>

                    <span>
                      <strong>CRITICAL ILLNESS HEALTH INSURANCE</strong>
                    </span>
                  </p>

                  <h3 className="popular-content-title">
                    We take care for you and you <strong>stay focused</strong> on <strong>your work and family.</strong>
                  </h3>

                  <p className="popular-content-text">Temporibus autem quibusdam et aut officiis debitis aut rerum a necessitatibus saepe eveniet ut et voluptates repudiandae sint molestiae non recusandae itaque.</p>

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

          <section className="plans" id="plans">
            <div className="container">
              <div className="plans-content">
                <div className="plans-icon">
                  <ion-icon name="pulse"></ion-icon>
                </div>

                <h2 className="h2 plans-title">Types of Insurances we provide</h2>

                <p className="plans-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                {/* <button className="btn btn-outline">Learn More</button> */}
              </div>

              <ul className="plans-list">
                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="man"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Individual Health Insurance</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>

                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="people"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Family Health Insurance</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>

                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="walk"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Senior Citizen Health Insurance</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>

                <li>
                  <div className="plans-card">
                    <div className="card-icon">
                      <ion-icon name="heart"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Critical Illness Health Insurance</h3>

                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="review" id="review">
            <div className="container">
              <h2 className="h2 section-title">Customer Reviews</h2>

              <p className="section-text">Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis eligendi cumque.</p>

              <ul className="review-list">
                <li>
                  <div className="review-card">
                    <figure className="review-banner">
                      <img src={maleAvatar} alt="customerImg" style={{ width: "70%" }} />
                    </figure>

                    <div className="review-meta">
                      <span>
                        <ion-icon name="calendar-outline"></ion-icon>

                        <time dateTime="2021-04-10">2022-08-10</time>
                      </span>

                      <span>
                        <ion-icon name="document-lock-sharp"></ion-icon>
                        <p>Jeevan Veema Plan</p>
                      </span>
                    </div>

                    <h3 className="review-title">Alex Simpson</h3>

                    <p className="review-text">Integer ante arcu accumsan a consectetuer eget posuere mauris praesent adipiscing phasellus ullamcorper ipsum rutrum punc.</p>

                    {/* <a href="#" className="review-link-btn">
                  <span>Learn More</span>

                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </a> */}
                  </div>
                </li>

                <li>
                  <div className="review-card">
                    <figure className="review-banner">
                      <img src={femaleAvatar} alt="customeImg" style={{ width: "70%" }} />
                    </figure>

                    <div className="review-meta">
                      <span>
                        <ion-icon name="calendar-outline"></ion-icon>

                        <time dateTime="2021-04-10">2021-04-10</time>
                      </span>

                      <span>
                        <ion-icon name="document-lock-sharp"></ion-icon>

                        <p>Old Age Plan</p>
                      </span>
                    </div>

                    <h3 className="review-title">Natasha Natalia</h3>

                    <p className="review-text">Integer ante arcu accumsan a consectetuer eget posuere mauris praesent adipiscing phasellus ullamcorper ipsum rutrum punc.</p>

                    {/* <a href="#" className="review-link-btn">
                  <span>Learn More</span>

                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </a> */}
                  </div>
                </li>

                <li>
                  <div className="review-card">
                    <figure className="review-banner">
                      <img src={maleAvatar} alt="Customer3" style={{ width: "70%" }} />
                    </figure>

                    <div className="review-meta">
                      <span>
                        <ion-icon name="calendar-outline"></ion-icon>

                        <time dateTime={Date.now()}>2023-08-23</time>
                      </span>

                      <span>
                        <ion-icon name="document-lock-sharp"></ion-icon>

                        <p>Child Protection Plan</p>
                      </span>
                    </div>

                    <h3 className="review-title">John Wick</h3>

                    <p className="review-text">Integer ante arcu accumsan a consectetuer eget posuere mauris praesent adipiscing phasellus ullamcorper ipsum rutrum punc.</p>

                    {/* <a href="#" className="review-link-btn">
                  <span>Learn More</span>

                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </a> */}
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="contact" id="contact">
            <div className="container">
              <h2 className="h2 section-title">Contact Us</h2>

              <p className="section-text">Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis eligendi cumque.</p>

              <div className="contact-wrapper">
                <form action="" className="contact-form">
                  <div className="wrapper-flex">
                    <div className="input-wrapper">
                      <label htmlFor="name">Name*</label>

                      <input type="text" name="name" id="name" required placeholder="Enter Your Name" className="input-field" />
                    </div>

                    <div className="input-wrapper">
                      <label htmlFor="emai">Email*</label>

                      <input type="text" name="email" id="email" required placeholder="Enter Your Email" className="input-field" />
                    </div>
                  </div>

                  <label htmlFor="message">Message*</label>

                  <textarea name="message" id="message" required placeholder="Type Your Message" className="input-field"></textarea>

                  <button type="submit" className="btn btn-primary">
                    <span>Send Message</span>

                    <ion-icon name="paper-plane-outline"></ion-icon>
                  </button>
                </form>

                <ul className="contact-list">
                  <li>
                    <a href="mailto:support@website.com" className="contact-link">
                      <ion-icon name="mail-outline"></ion-icon>

                      <span>: support@website.com</span>
                    </a>
                  </li>

                  <li>
                    <a href="/" className="contact-link">
                      <ion-icon name="globe-outline"></ion-icon>

                      <span>: www.website.com</span>
                    </a>
                  </li>

                  <li>
                    <a href="tel:+911234567890" className="contact-link">
                      <ion-icon name="call-outline"></ion-icon>

                      <span>: (+91) 123 456 7890</span>
                    </a>
                  </li>

                  <li>
                    <div className="contact-link">
                      <ion-icon name="time-outline"></ion-icon>

                      <span>: 9:00 AM - 6:00 PM</span>
                    </div>
                  </li>

                  <li>
                    <a href="/" className="contact-link">
                      <ion-icon name="location-outline"></ion-icon>

                      <address>Address of the comapny</address>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default Main;
