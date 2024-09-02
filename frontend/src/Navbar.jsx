import React, { useLayoutEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/navbar.css";
import nav_logo from "./assets/nav_logo.svg";
import Footer from "./Footer";
import FlipLink from "./Components/FlipLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: { opacity: 0, x: "-100%" },
    open: { opacity: 1, x: 0 },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  useLayoutEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <main className="m-container">
      <nav className="m-nav">
        <Link to="/">
          <img src={nav_logo} alt="MeetzFlow" className="m-nav-logo" />
        </Link>
        <ul className="m-nav-links desktop-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <HashLink smooth to="/#features">
              Features
            </HashLink>
          </li>
          <li>
            <HashLink smooth to="/#testimonials">
              Testimonials
            </HashLink>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <FlipLink
          className="m-get-started-btn desktop-menu"
          buttonText={isLoggedIn ? "DASHBOARD" : "START FOR FREE"}
          link={isLoggedIn ? "/app" : "/get-started"}
        />
        <div className="hamburger" onClick={toggleMenu}>
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: { rotate: 0 },
              open: { rotate: 45, y: 9 },
            }}
          />
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
          />
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: { rotate: 0 },
              open: { rotate: -45, y: -9 },
            }}
          />
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.5 }}
          >
            <ul className="m-nav-links">
              <motion.li variants={linkVariants} transition={{ delay: 0.1 }}>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} transition={{ delay: 0.2 }}>
                <HashLink smooth to="/#features" onClick={toggleMenu}>
                  Features
                </HashLink>
              </motion.li>
              <motion.li variants={linkVariants} transition={{ delay: 0.3 }}>
                <HashLink smooth to="/#testimonials" onClick={toggleMenu}>
                  Testimonials
                </HashLink>
              </motion.li>
              <motion.li variants={linkVariants} transition={{ delay: 0.4 }}>
                <Link to="/contact" onClick={toggleMenu}>
                  Contact
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} transition={{ delay: 0.5 }}>
                <FlipLink
                  className="m-get-started-btn"
                  buttonText={isLoggedIn ? "DASHBOARD" : "START FOR FREE"}
                  onClick={toggleMenu}
                  link={isLoggedIn ? "/app" : "/get-started"}
                />
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <Outlet />
      <Footer />
    </main>
  );
};

export default Navbar;
