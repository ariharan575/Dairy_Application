import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gray-100">
      <div className="card shadow-lg border-0 text-center p-5 bg-white rounded-4" style={{ maxWidth: "420px" }}>
        
        <h1 className="display-1 fw-bold text-secondary">404</h1>

        <h4 className="fw-semibold text-dark mb-3">
          Oops! Page Not Found
        </h4>

        <p className="text-muted mb-4">
          The page you are looking for might have been removed,
          renamed or temporarily unavailable.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="btn btn-dark px-4 py-2 rounded-3"
        >
          Go Back Home
        </button>

      </div>
    </div>
  );
}