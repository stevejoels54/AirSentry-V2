import * as React from "react";
import CircularProgress from "react-native-circular-progress-indicator";
import generateColor from "../helpers/generateColor";

interface ProgressIndicatorProps {
  value: number;
}

const CircularProgressIndicator = ({ value }: ProgressIndicatorProps) => {
  return (
    <CircularProgress
      value={value}
      maxValue={1000}
      activeStrokeWidth={15}
      progressValueColor={"#fff"}
      //   activeStrokeColor="#B3D962"
      activeStrokeColor={generateColor("air", value)}
      activeStrokeSecondaryColor={"#2465FD"}
      inActiveStrokeColor="#fff"
      inActiveStrokeOpacity={0.5}
      inActiveStrokeWidth={15}
      title={"PPM"}
      radius={170}
    />
  );
};

export default CircularProgressIndicator;
