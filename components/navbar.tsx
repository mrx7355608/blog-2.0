'use client';

import Link from 'next/link';

export const Navbar = () => {
  const openModal = () => {
	  // eslint-disable-next-line
    (document.getElementById('my_modal_5') as any).showModal();
  };

  return (
    <div className="navbar bg-transparent w-full lg:w-3/4 border-2 border-gray-900 mx-auto rounded-lg my-2 mt-4">
      <div className="navbar-start">
        <Link href="/" className="ml-3 text-xl font-black">
          FAWAD IMRAN
        </Link>
      </div>
      <div className="navbar-end">
        <div className="hidden sm:flex gap-7 font-medium items-center">
          <Link className="hover:text-sky-300" href="/">
            Home
          </Link>
          <Link className="hover:text-sky-300" href="/about">
            About
          </Link>
          <Link
            className="hover:text-sky-300"
            href="https://mrx7355608.github.io/portfolio"
          >
            Portfolio
          </Link>
        </div>
        <button className="btn ml-3 btn-ghost btn-circle" onClick={openModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <div className="dropdown dropdown-end sm:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-900 rounded-md z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">
                Homepage 
              </Link>
            </li>
            <li>
              <Link href="https://mrx7355608.github.io/portfolio">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
