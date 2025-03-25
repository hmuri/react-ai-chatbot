import React from "react";
import MicSVG from "./mic.svg";

const MicIcon = (props) => {
  return <img src={MicSVG} alt="mic" {...props} />;
};

export default MicIcon;
