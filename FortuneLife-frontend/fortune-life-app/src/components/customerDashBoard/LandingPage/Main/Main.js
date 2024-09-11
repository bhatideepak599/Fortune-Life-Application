import React from "react";
import "./Main.css";

const Main = () => {
  return (
    <>
      <main className="mt-0" style={{ backgroundColor: "#F9F9F9" }}>
        <article>
          <section className="about">
            <div className="container">
              <div className="about-content">
                <div className="about-icon">
                  <ion-icon name="shield-checkmark"></ion-icon>
                </div>

                <h2 className="h2 about-title">Your Security, Our Priority</h2>

                <p className="about-text">At SecureLife Insurance, we understand the importance of safeguarding your future. From protecting your personal data to providing reliable coverage, we're here to ensure your peace of mind.</p>

                <button className="btn btn-outline text-white" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                  Learn More
                </button>
              </div>

              <ul className="about-list">
                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="checkmark-done"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Easy Claims Process</h3>

                    <p className="card-text">We prioritize simplicity in your claims process. With us, you can file claims quickly and easily, ensuring a smooth experience in times of need.</p>
                  </div>
                </li>

                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="lock-closed"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Top-Notch Security</h3>

                    <p className="card-text">Your policy details and personal information are protected with the highest security standards in the industry.</p>
                  </div>
                </li>

                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="cash"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Flexible Payments</h3>

                    <p className="card-text">We offer flexible payment options for your premium so that your policy remains active without any hassle.</p>
                  </div>
                </li>

                <li>
                  <div className="about-card">
                    <div className="card-icon">
                      <ion-icon name="finger-print"></ion-icon>
                    </div>

                    <h3 className="h3 card-title">Data Privacy Assured</h3>

                    <p className="card-text">We ensure your sensitive data is always safe. Your privacy is our top concern.</p>
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
