"use client"

import React from 'react'

const GlitterFire = ({ className }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="fire-container" />
      <style jsx>{`
        .fire-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .fire-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            url("https://assets.codepen.io/13471/silver-glitter-background.png"),
            url("https://assets.codepen.io/13471/silver-glitter-background.png"),
            linear-gradient(
              0deg,
              white 0px,
              #ff8951 5px,
              #dcbc169c 30%,
              transparent 70%
            ),
            radial-gradient(ellipse at bottom, transparent 30%, black 60%);
          background-size: 350px 500px, 400px 650px, 100% 100%, 100% 100%;
          background-blend-mode: hard-light, color-dodge, multiply;
          background-position: 0px 0px, 0px 0px, 50% 100%;
          background-repeat: repeat, repeat, repeat, no-repeat;
          mix-blend-mode: color-dodge;
          filter: brightness(3.7) blur(7px) contrast(6);
          animation: fire 1.75s linear infinite;
          box-shadow: inset 0 -40px 50px -60px #63bbc5;
        }

        @keyframes fire {
          0% {
            background-position: center 0px, center 0px, 50% 100%, center center;
          }
          100% {
            background-position: center -500px, center -650px, 50% 100%, center center;
          }
        }
      `}</style>
    </div>
  )
}

export default GlitterFire
