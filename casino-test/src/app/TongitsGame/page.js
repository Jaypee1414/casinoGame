"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import PercentageLoader from "../components/PercentageLoad";
import CrystalSnowAnimation from "../components/snowflakes";
import { useRouter } from 'next/navigation';

function TogitsGame() {
  const [isFinished, setIsFinished] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/TongitsGame/play-bot');
  };

  const handleButtonClickLive = () => {
    router.push('/TongitsGame/Gamebet');
  };
  

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render a fallback while ensuring client-side rendering
  }

  return (
    <div>
      {!isFinished ? (
        <PercentageLoader setIsFinished={setIsFinished} />
      ) : (
        <div className="w-screen h-screen relative">
          <div className=" inset-0 flex items-center justify-center z-50 h-[90vh] ">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(8, 14, 129, 0.8) 25%, rgba(37, 79, 100, 0.8) 44%)",
                zIndex: -1, // Send it to the background
              }}
            ></div>
            <div className="left-5 absolute top-5">
              <div className="flex flex-row gap-1 ">
                <div>
                  <button>
                    <Image
                      src="/image/contactUs.svg"
                      alt="My image"
                      width={20} // You need to specify width and height
                      height={20} // You need to specify width and height
                       className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[35px] md:h-[35px] lg:w-[40px] lg:h-[40px]  xl:w-[55px] xl:h-[55px] 2xl:w-[70px] 2xl:h-[70px] "
                    />
                  </button>
                </div>
                <div>
                  <button>
                    {" "}
                    <Image
                      src="/image/settings.svg"
                      alt="My image"
                      width={20} // You need to specify width and height
                      height={20} // You need to specify width and height
                       className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[35px] md:h-[35px] lg:w-[40px] lg:h-[40px]  xl:w-[55px] xl:h-[55px] 2xl:w-[70px] 2xl:h-[70px]"
                    />
                  </button>
                </div>
                <div>
                  <button>
                    {" "}
                    <Image
                      src="/image/question.svg"
                      alt="My image"
                      width={20} 
                      height={20} 
                      className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[35px] md:h-[35px] lg:w-[40px] lg:h-[40px]  xl:w-[55px] xl:h-[55px] 2xl:w-[70px] 2xl:h-[70px] "
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[30rem] h-[20rem] sm:w-[30rem] sm:h-[15rem] md:w-[40rem] md:h-[18rem] lg:w-[50rem] lg:h-[20rem] xl:w-[80rem] xl:h-[40rem] 2xl:w-[90rem] 2xl:h-[40rem] text-center mt-[25px] sm:mt-[20px] md:mt-[1px] lg:mt-[-120px] xl:mt-[20px] 2xl:mt-[20px]">
              <div className="flex justify-center items-start sm:items-center md:items-center lg:items-center xl:items-center 2xl:items-center py-10 sm:py-[1px] md:py-[1px] lg:py-[3px] ">
                       <Image
                          src="/image/svg_land.svg"
                          alt="Gon Portrait"
                          className="slow-high-bounce w-[500px] h-[500px] sm:max-w-[150px] sm:max-h-[90px] md:max-w-[170px] md:max-h-[140px] lg:max-w-[250px] lg:max-h-[250px] xl:max-w-[300px] xl:max-h-[300px] 2xl:max-w-[370px] 2xl:max-h-[350px] sm:mt-2 sm:mb-[-26px] md:mt-4 lg:mt-6  "
                          width={500} // Default width for mobile
                          height={500} // Default height for mobile
                        />
              </div>

              <div
              className="justify-between overflow-hidden flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20 text-white stroke-black font-black landing"
              style={{
                WebkitTextStroke: "0.1px black ",
                textStroke: "0.1px black",
              }}
              >
           <div className="flex flex-col items-center justify-center w-full h-full sm:mt[14px] md:mt-[18px] lg:mt-[22px] xl:mt-[26px] 2xl:mt-[30px]">
 
              <h3 className="bg-clip-text text-transparent bg-text-gradient font-bold mb-[-18px]">
                 Choose Your Game Mode
              </h3>

         <div className="flex flex-row gap-6 mb-[-10px] justify-center w-full">
            <div className="flex justify-center">
             <button 
              className="bg-[url('/image/playbotButton.svg')] bg-no-repeat bg-center bg-cover sm:bg-contain md:bg-cover lg:bg-cover xl:bg-cover 2xl:bg-cover"
              onClick={handleButtonClick}
              >
               <p className="text-[12px] sm:text-[12px] md:text-[18px] lg:text-[24px] font-bold tracking-tight text-transparent  text-white">
                  Play with bot
               </p>
               </button>
            </div>

            <div className="flex justify-center">
             <button
              className="bg-[url('/image/playbotButton.svg')] bg-no-repeat bg-center bg-cover sm:bg-contain md:bg-cover lg:bg-cover xl:bg-cover 2xl:bg-cover w-full sm:w-auto "
              onClick={handleButtonClickLive}
               >
                <p className="text-[12px] sm:text-[16px] md:text-[18px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px] font-bold tracking-tight text-transparent text-white">
                  Live Game
                </p>
             </button>
           </div>
          </div>
       </div>

              </div>
            </div>
          </div>
          <div className="w-screen h-auto sm:h-[10px] md:h-[40px] lg:h-[36px] xl:h-[42px] 2xl:h-[52px] relative flex justify-center items-center wood">
            <div
              className="absolute flex flex-row gap-2"
              style={{
                WebkitTextStroke: "0.5px black",
                textStroke: "0.5px black", // Fallback
              }}
            >
              <input type="checkbox" id="acceptTerms" className="mt-[26px] sm:mt-[20px] sm:w-[12px] md:mt-[-16px] md:w-[14px] lg:mt-[52px] lg:w-[16px] xl:mt-[5px] xl:w-[18px] 2xl:mt-[60px] 2xl:w-[20px]" />
              <p>Accept Terms and Condition</p>
            </div>
            <img
              src="/image/wood.svg"
              alt="My image"
              className="w-full h-auto mt-[20px] sm:mt-[20px] md:mt-[-13px] lg:mt-[52px] xl:mt-[5px] 2xl:mt-[60px] "
            />
          </div>
         
        </div>
      )}
    </div>
  );
}

export default TogitsGame;
