import { set } from "mongoose";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm , setSearchTerm]= useState('');
  const navigate = useNavigate();
  const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  })

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            onChange={(e)=> setSearchTerm(e.target.value)}
          />
          <button>
          <FaSearch className="text-slate-600" />

          </button>
        </form>

        <ul className="flex gap-4 items-center">
          <li>
            <Link
              to="/"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              About
            </Link>
          </li>

          {currentUser ? (
            <li>
              <Link to="/profile">
                <img
                  className="h-7 w-7 rounded-full object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="/sign-in"
                className="hidden sm:inline text-slate-700 hover:underline"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
