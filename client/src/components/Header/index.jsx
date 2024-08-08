import Auth from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Header = () => {

const navigate = useNavigate();

    useEffect(()=> {
        if (!Auth.loggedIn()){
            navigate("/login")
        }
    }, [navigate]);

    const handleBtnClick = async (e) => {
        Auth.logout();
        //take to /login
        navigate("/login", { replace: true });
    }

    if (Auth.loggedIn()) {
        const user = Auth.getProfile().data;
        return (
        <>
            <header>
                <h1>Welcome back, {user.username}!</h1>
            </header>
            <button onClick={handleBtnClick}>log out</button>
        </>
    )
    } 
        return null; 
};


export default Header;