import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex gap-4 p-4 text-white justify-end bg-stone-800 items-center">
      <Link 
        to="/" 
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-500 hover:bg-green-500 hover:text-black font-medium"
      > Home</Link>
      <Link 
        to="/about" 
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-500 hover:bg-green-500 hover:text-black font-medium"
      > About</Link>

      <Link 
        to="/staff" 
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-500 hover:bg-green-500 hover:text-black font-medium"
      > Staff</Link>

      <Link 
        to="/customer" 
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-500 hover:bg-green-500 hover:text-black font-medium"
      >Customer</Link>
    </div>
  );
}