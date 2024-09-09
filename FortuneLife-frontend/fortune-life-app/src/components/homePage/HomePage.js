import React from "react";
import HomePageNavbar from "./HomePageNavbar/HomePageNavbar";
import Main from "./Main/Main";
import Footer from "../sharedComponents/CommonNavbarFooter/Footer";

const HomePage = () => {
  return (
    <>
      <HomePageNavbar />
      <Main />
      <Footer />
    </>
  );
};

export default HomePage;
