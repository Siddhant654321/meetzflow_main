import { useEffect } from "react";
import "./styles/verifyEmail.css";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "./CustomHooks/useAxios";

const Error = () => {
  const navigate = useNavigate();
  const passedState = useLocation().state;
  const axios = useAxios();

  useEffect(() => {
    if (!passedState) {
      navigate("/");
    }
  }, []);

  if (!passedState) {
    return null;
  }

  const { error } = passedState;

  const logout = async (event) => {
    event.preventDefault();
    await axios.get("/account/endpoint/logout", { withCredentials: true });
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="ve-background">
      <h3>{error}</h3>
      <div className="d-flex gap-3">
        {!localStorage.getItem("loggedIn") ? (
          <button id="ve-btn" onClick={() => navigate("/")}>
            Go To Home
          </button>
        ) : (
          <button id="ve-btn" onClick={() => navigate("/app")}>
            Go To Dashboard
          </button>
        )}
        {error === "Please confirm your email before you proceed" && (
          <button id="ve-btn" onClick={(e) => logout(e)}>
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
