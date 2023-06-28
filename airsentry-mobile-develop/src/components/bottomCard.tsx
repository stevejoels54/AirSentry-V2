import * as React from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Condition from "./condition";
import { map } from "lodash";
import { useDispatch } from "react-redux";
import actions from "../config/actions/actions";
import { RouteProp, useRoute } from "@react-navigation/native";

const BottomCard = ({
  navigation,
  latestReadings,
  latestReadingsLoading,
  refreshReadings,
}) => {
  const dispatch = useDispatch();
  const getConditionProgress = (
    min: number,
    max: number,
    value: number
  ): number => {
    if (value < min) {
      return 0;
    } else if (value > max) {
      return 1;
    } else {
      return (value - min) / (max - min);
    }
  };
  const { deviceCode, deviceId } = useRoute<
    RouteProp<{
      device: {
        deviceCode: string;
        deviceId: string;
      };
    }>
  >().params;
  const sensorDetails = (sensorId: string) => {
    navigation.navigate("Trends", {
      deviceCode,
      sensorId,
      mode: "Single Sensor",
      period: "day",
      deviceId,
    });
    dispatch(actions.getTrends(deviceCode, `sensors/${sensorId}`, "day"));
    dispatch(actions.getInsights(deviceCode, `sensor/${sensorId}`, "day"));
  };
  return (
    <View style={styles.bottomCard}>
      <View style={styles.content}>
        <ScrollView
          refreshControl={
            <RefreshControl
              colors={["white"]}
              refreshing={latestReadingsLoading}
              onRefresh={refreshReadings}
            />
          }
        >
          {map(latestReadings.latestSensorReadings, (reading) => {
            return (
              <Condition
                key={reading.sensorCode}
                onPress={() => sensorDetails(reading.sensorId)}
                condition={{
                  name: reading.sensorName,
                  value: `${reading.sensorValue} ${reading.sensorUnits}`,
                  comment: reading.comment || "No Comment",
                  progress: getConditionProgress(
                    reading.min || 0,
                    reading.max || 0,
                    reading.sensorValue
                  ),
                  color: reading.colorCode,
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomCard: {
    height: "35%",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default BottomCard;
