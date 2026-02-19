export default function SearchBar({ value, onChange }) {
  return (
    <div className="items-center space-x-3 md:w-100 mx-auto mb-2
      flex-1 rounded-full bg-white px-6 py-2 shadow-md">

      <i className="bi bi-search"></i>

      <input
        type="text"
        placeholder="Search..."
        value={value}              
        onChange={(e) => onChange(e.target.value)}        
        className="focus:outline-none w-75"
      />
    </div>
  );
}


