import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import { ICondition } from "../types";
import generateColor from "../helpers/generateColor";
import { toString } from "lodash";

interface ConditionProps {
  condition: ICondition;
  onPress: () => void;
}

const Condition = ({ condition, onPress }: ConditionProps) => {
  const { name, value, comment, progress, color } = condition;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <View style={styles.condition}>
        <View style={styles.conditionComment}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 25 }}>{name}</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "#8A8A8A" }}>
            {comment}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {value}
        </Text>
      </View>
      <Progress.Bar
        animated={true}
        progress={progress}
        width={370}
        height={8}
        borderWidth={0}
        unfilledColor="#F2E3D0"
        color={color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  condition: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  conditionComment: {
    flexDirection: "column",
    marginBottom: 10,
  },
});

export default Condition;
