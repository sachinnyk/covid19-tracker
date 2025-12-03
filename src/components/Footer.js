import React from "react";

function Footer() {
  return (
    <footer>
      <div className="footer-copyright">
        <div className="container-fluid">
          © {new Date().getFullYear()} Copyright: Sachin Nayak
        </div>
      </div>
    </footer>
  );
}

export default Footer;
