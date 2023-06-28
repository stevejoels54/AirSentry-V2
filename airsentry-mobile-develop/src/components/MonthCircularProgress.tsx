import React from "react";
import CircularProgress from "react-native-circular-progress-indicator";

const MonthCircularProgress = ({ periodAverage, units, color }) => {
  return (
    <CircularProgress
      value={periodAverage}
      maxValue={100}
      activeStrokeWidth={10}
      progressValueColor={"#fff"}
      //   activeStrokeColor="#B3D962"
      activeStrokeColor={color}
      activeStrokeSecondaryColor={"#2465FD"}
      inActiveStrokeColor="#fff"
      inActiveStrokeOpacity={0.5}
      inActiveStrokeWidth={10}
      title={units}
      radius={110}
    />
  );
};

MonthCircularProgress.defaultProps = {
  periodAverage: 0,
  units: "units",
  color: "blue",
};

export default MonthCircularProgress;
