import { useNavigate } from "react-router-dom";
import FlipLink from "./Components/FlipLink";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="ve-background">
      <h3 className="m-subheading" style={{ fontSize: 32 }}>
        The page you are looking for does not exist!
      </h3>
      {!localStorage.getItem("loggedIn") ? (
        <FlipLink
          className="m-get-started-btn"
          buttonText="Go To Home"
          onClick={() => navigate("/")}
        />
      ) : (
        <FlipLink
          className="m-get-started-btn"
          buttonText="Go To Dashboard"
          onClick={() => navigate("/app")}
        />
      )}
    </div>
  );
}
