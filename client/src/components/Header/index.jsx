import Auth from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from 'react-icons/fa';

const Header = () => {

const navigate = useNavigate();

    const handleBtnClick = async (e) => {
        Auth.logout();
        //take to /login
        console.log("Navigated to http://localhost:3000/login");
        navigate('/login', { replace: true });
    };

    if (Auth.loggedIn()) {
        const user = Auth.getProfile().data;

        return (
        <>
            <header className="d-flex align-items-center justify-content-around p-3 bg-light">
                <h1>Welcome back, {user.username}!</h1>
                <button 
                className="btn btn-block btn-primary"
                onClick={handleBtnClick}>
                    log out
                </button>
            </header>    
        </>
    )
    } 
    return (
        <>
            <header className="d-flex align-items-center justify-content-around p-3">
                <h1>TO-DO LIST APP</h1>
                <FaClipboardList />
            </header>    
        </>
    ); 
};

export default Header;