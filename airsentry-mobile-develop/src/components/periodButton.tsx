import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const PeriodButton = ({
  trendPeriod,
  changePeriod,
  periodValue,
  periodName,
}) => {
  return (
    <TouchableOpacity onPress={() => changePeriod(periodValue)}>
      <Text
        style={{
          ...styles.periodButton,
          textDecorationLine:
            trendPeriod === periodValue ? "underline" : "none",
          color: trendPeriod === periodValue ? "#FFD700" : "white",
        }}
      >
        {periodName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  periodButton: {
    color: "white",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
});

export default PeriodButton;
