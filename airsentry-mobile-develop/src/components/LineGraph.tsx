import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";

const screenWidth = Dimensions.get("window").width * 0.92;

const LineGraph = ({ labels, data }) => {
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });
  return (
    <LineChart
      data={{
        labels,
        datasets: [
          {
            data,
          },
        ],
      }}
      width={screenWidth}
      height={256}
      verticalLabelRotation={15}
      chartConfig={{
        propsForBackgroundLines: {
          strokeWidth: 0,
        },
        formatYLabel: (yValue) => {
          return yValue + "°C";
        },
        backgroundColor: "#5271ff",
        backgroundGradientFrom: "#5271ff",
        backgroundGradientTo: "#5271ff",
        color: (opacity = 1) => `#fff`,
        fillShadowGradientFrom: "#5271ff",
        fillShadowGradientTo: "#5271ff",
        propsForHorizontalLabels: {
          fill: "#5271ff",
        },
        useShadowColorFromDataset: false, // optional
      }}
      bezier
      decorator={() => {
        return tooltipPos.visible ? (
          <View>
            <Svg>
              <Rect
                x={tooltipPos.x - 15}
                y={tooltipPos.y + 10}
                width="40"
                height="30"
                fill="black"
              />
              <TextSVG
                x={tooltipPos.x + 5}
                y={tooltipPos.y + 30}
                fill="white"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
              >
                {tooltipPos.value}
              </TextSVG>
            </Svg>
          </View>
        ) : null;
      }}
      onDataPointClick={(data) => {
        let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

        isSamePoint
          ? setTooltipPos((previousState) => {
              return {
                ...previousState,
                value: data.value,
                visible: !previousState.visible,
              };
            })
          : setTooltipPos({
              x: data.x,
              value: data.value,
              y: data.y,
              visible: true,
            });
      }}
    />
  );
};

LineGraph.defaultProps = {
  labels: [""],
  data: [0],
};

export default LineGraph;
