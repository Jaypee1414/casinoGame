"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);


  const handleButtonClick = () => {
    router.push('/TongitsGame/Gamebet');
  };

  
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 "></div>
      <div className="absolute inset-0 overflow-hidden ">
        <div
          className={`absolute inset-0 bg-opacity-75 transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        ></div>
        <section
          className={`absolute inset-y-0 left-0 max-w-full flex transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-screen max-w-md ">
            <div className="h-full w-72 flex flex-col bg-gradient-to-b from-[rgba(124,85,75,0.9)] to-[rgba(27,46,54,0.98)] shadow-xl overflow-y-scroll z-20 sm:w-[180px]">
              <div>
                <div className="flex items-center px-5 justify-end bg-gradient-to-r from-[rgba(173,0,0,1)] to-[rgba(23,33,34,1)] h-16  bg-opacity-70 -z-10 sm:w-[180px] sm:h-[25px]">
                  <button
                    onClick={onClose}
                    className="text-black hover:text-gray-500 focus:outline-none octagon bg-white p-1 shadow-md focus:text-gray-500 transition ease-in-out duration-150 z-10 sm:w-[15px] sm:h-[15px]"
                  >
                    <svg
                      className="h-5 w-5 sm:w-[12px] sm:h-[12px] sm:mt-[-2px] sm:ml-[-2px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6 relative flex-1 px-2 ">
                <div className="absolute inset-0 px-2 ">
                  <div className="h-full bg-f" aria-hidden="true">
                    <nav className="space-y-4">
                      <div className="bg-[url('/image/nameBorder.svg')] bg-no-repeat bg-cover bg-center h-24 flex justify-center items-center relative sm:w-[160px] sm:h-[60px] sm:mt-[-16px]">
                        <div className="flex flex-col ml-9">
                          <h3 className="bg-clip-text text-transparent bg-user-name text-2xl  font-bold sm:text-[14px]">
                            Jeorge Pakaw
                          </h3>
                          <p className="text-sm bg-clip-text text-transparent bg-text-gradient tracking-tight sm:text-[8px]">
                            Jeorge@gmail.com
                          </p>
                        </div>
                        <div className="absolute left-3 bottom-[-18px] h-auto">
                          <img
                            src="https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
                            className="rounded-full border-gray-300 border-2 bg-black w-14 h-14 sm:w-[42px] sm:h-[35px] sm:mt-[-50px] sm:ml-[-8px] "
                          />
                        </div>
                      </div>
                      <div className="mt-48 space-y-4">
                        <div className="mt-10  border-gray-500 border-b p-2 hover:bg-[rgba(124,85,75,0.2)] w-full sm:p-[1px] cursor-pointer">
                          <button className="font-jaro text-white font-extrabold text-2xl sm:text-[10px] ">
                            Switch Table
                          </button>
                        </div>
                        <div className=" border-gray-500 border-b p-2 hover:bg-[rgba(124,85,75,0.2)]  sm:p-[1px] ">
                          <button className="font-jaro text-white font-extrabold text-2xl sm:text-[10px]">
                            Store
                          </button>
                        </div>
                        <div  className=" border-gray-500 border-b p-2 hover:bg-[rgba(124,85,75,0.2)]  sm:p-[1px] ">
                          <button className="font-jaro text-white font-extrabold text-2xl sm:text-[10px] ">
                            Game Rules
                          </button>
                        </div>
                        <div  className=" border-gray-500 border-b p-2  hover:bg-[rgba(124,85,75,0.2)]  sm:p-[1px] ">
                          <button className="font-jaro text-white font-extrabold text-2xl sm:text-[10px]">
                            Stand to Spectate
                          </button>
                        </div>
                        <div  className=" border-gray-500 border-b p-2 hover:bg-[rgba(124,85,75,0.2)] sm:p-[1px] ">
                          <button className="font-jaro text-white font-extrabold text-2xl sm:text-[10px] ">
                            Settings
                          </button>
                        </div>
                        <div  className=" border-gray-500 border-b p-2  cursor-pointer hover:bg-[rgba(124,85,75,0.2)] sm:p-[1px] " onClick={handleButtonClick}>
                          <button className="font-jaro text-white font-extrabold text-2xl sm:text-[10px]">
                            Quit
                          </button>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sidebar;
