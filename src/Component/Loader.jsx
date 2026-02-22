function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div 
        className="spinner-border text-secondary" 
        role="status" 
        style={{ width: "2rem", height: "2rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>

    </div>
  );
}

export default Loader;