import React from "react";
import Lottie from "react-lottie";
import loadingAnimation from "./loading.json";

const LoadingLottie = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMinYMin meet",
    },
  };

  return (
    <div style={{ width: "100px", marginLeft: "-10px" }}>
      <Lottie options={defaultOptions} height={41} width={99} />
    </div>
  );
};

export default LoadingLottie;
