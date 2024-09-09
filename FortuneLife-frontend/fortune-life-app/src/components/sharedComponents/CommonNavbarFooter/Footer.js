import React from "react";
import "./Footer.css";
import fortuneLifeLogo from "../../../images/fortunelife-high-resolution-logo-white-transparent.png";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-top pt-4 pb-2">
          <div className="container">
            <div className="footer-brand">
              <a href="/" className="logo">
                <img src={fortuneLifeLogo} alt="Fortune Life's Logo" width={250} />
              </a>

              <p className="footer-text">ante ipsum primis in faucibus ultrices posuere cubilia.</p>

              <ul className="social-list">
                <li>
                  <a href="/" className="social-link">
                    <ion-icon name="logo-facebook"></ion-icon>
                  </a>
                </li>

                <li>
                  <a href="/" className="social-link">
                    <ion-icon name="logo-twitter"></ion-icon>
                  </a>
                </li>

                <li>
                  <a href="/" className="social-link">
                    <ion-icon name="logo-instagram"></ion-icon>
                  </a>
                </li>

                <li>
                  <a href="/" className="social-link">
                    <ion-icon name="logo-linkedin"></ion-icon>
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-link-box">
              <ul className="footer-list">
                <li>
                  <p className="footer-item-title">ABOUT US</p>
                </li>

                <li>
                  <a href="/" className="footer-link">
                    Features
                  </a>
                </li>

                
              </ul>

              <ul className="footer-list">
                <li>
                  <p className="footer-item-title">CUSTOMERS</p>
                </li>

                <li>
                  <a href="/" className="footer-link">
                    Trending
                  </a>
                </li>

                
              </ul>

              <ul className="footer-list">
                <li>
                  <p className="footer-item-title">SUPPORT</p>
                </li>

                <li>
                  <a href="/" className="footer-link">
                    Developers
                  </a>
                </li>

               
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p className="copyright">
              &copy; 2024 <a href="/">fortunelife</a>. All Right Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
