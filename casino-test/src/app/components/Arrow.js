import React from "react";
import Image from "next/image";
function Arrow() {
  return (
    <div>
      <Image
      width={1000}
      height={1000}
        src="/image/arrowDiscardPile.svg"
        alt="My image"
        className="w-20 h-20 sm:w-4 sm:h-4  absolute slow-high-bounce" // Explicit width and height sm:w-[20px] sm:h-[20px] sm:mt-[-55px]
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      />
    </div>
  );
}

export default Arrow;
