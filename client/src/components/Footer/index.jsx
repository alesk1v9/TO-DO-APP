import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {

    const currentYear = new Date().getFullYear();

    return (
      <footer className="d-flex align-items-center justify-content-center p-3">
        
          <a href="https://github.com/alesk1v9" 
          target="_blank"
          className="text-dark fs-3 mx-3"> <FaGithub/> </a>

          <a href="https://www.linkedin.com/in/alexsander-souza-0169482b5/"
          target="_blank"
          className="text-dark fs-3 mx-3"> <FaLinkedin /> </a>

          <span className="mx-3">© {currentYear}</span>
         
      </footer>
    );
  }
  
  export default Footer;