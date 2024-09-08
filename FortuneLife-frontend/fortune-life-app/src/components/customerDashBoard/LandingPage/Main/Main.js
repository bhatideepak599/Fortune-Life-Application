import React from "react";
import family2 from "../../../../images/undraw_family_vg76.svg";
import "./Main.css";
import family from "../../../../images/undraw_play_time_-7-k7b.svg";
import hospital from "../../../../images/undraw_medical_care_movn.svg";
import maleAvatar from "../../../../images/undraw_male_avatar_g98d.svg";
import femaleAvatar from "../../../../images/undraw_female_avatar_efig.svg";

const Main = () => {
  return (
    <>
      <main className="mt-0">
        <article>
          <section className="about">
            <div className="container">
              <div className="about-content">
                <div className="about-icon">
                  <ion-icon name="star"></ion-icon>
                </div>

                <h2 className="h2 about-title">Why Choose Us ?</h2>

                <p className="about-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                <button className="btn btn-outline text-white" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                  Learn More
                </button>
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
        </article>
      </main>
    </>
  );
};

export default Main;
