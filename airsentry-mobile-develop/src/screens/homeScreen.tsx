import React, { useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import CircularProgressIndicator from "../components/circularProgressIndicator";
import IntroTitle from "../components/introTitle";
import BottomCard from "../components/bottomCard";
import generateComment from "../helpers/generateComment";
import { useDispatch, useSelector } from "react-redux";
import { filter, find, inRange, isEmpty, map, meanBy, toString } from "lodash";
import actions from "../config/actions/actions";
import { RouteProp, useRoute } from "@react-navigation/native";
import socket from "../config/socket";
import formatLatestResult from "../helpers/formatLatestResult";

const HomeScreen = ({ navigation }) => {
  const {
    deviceDetails,
    latestReadings,
    latestReadingsLoading,
    latestReadingsError,
  } = useSelector((state: any) => state.rootReducer);

  const dispatch = useDispatch();
  const { deviceCode, deviceId } = useRoute<
    RouteProp<{
      device: {
        deviceCode: string;
        deviceId: string;
      };
    }>
  >().params;

  useEffect(() => {
    dispatch(actions.getLatestReadings(deviceCode));
    dispatch(actions.getDeviceDetails(deviceId));
  }, [deviceId, deviceCode]);

  const refreshReadings = () => {
    dispatch(actions.getLatestReadings(deviceDetails?.device?.deviceCode));
  };

  const airQualityDetails = () => {
    navigation.navigate("Trends", {
      deviceCode,
      mode: "Air Quality",
      period: "day",
      deviceId,
    });
    dispatch(actions.getTrends(deviceCode, `air-quality/${deviceId}`, "day"));
    dispatch(actions.getInsights(deviceCode, deviceId, "day"));
  };

  useEffect(() => {
    if (!isEmpty(latestReadingsError.data)) {
      const { data } = latestReadingsError || {};
      Alert.alert(toString(data?.server?.message), data?.message);
    }
  }, [latestReadingsError]);

  useEffect(() => {
    socket.on("new_reading", (data) => {
      const latest = formatLatestResult(data, deviceDetails);
      dispatch(actions.setLatestReadings(latest));
    });
  }, [socket]);

  return (
    <View style={styles.container}>
      {latestReadingsLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <IntroTitle title="Air Sentry" subtitle={"Loading..."} />
        </View>
      ) : (
        <>
          <View style={styles.homeTitle}>
            <View style={styles.titleContainer}>
              <IntroTitle
                title={deviceDetails?.device?.deviceLocation}
                subtitle={generateComment(
                  "air",
                  latestReadings.airQuality?.value
                )}
              />
            </View>
            <TouchableOpacity onPress={airQualityDetails}>
              <CircularProgressIndicator
                value={
                  isNaN(latestReadings.airQuality?.value)
                    ? 0
                    : latestReadings.airQuality?.value
                }
              />
            </TouchableOpacity>
          </View>
          <BottomCard
            latestReadings={latestReadings}
            navigation={navigation}
            latestReadingsLoading={latestReadingsLoading}
            refreshReadings={refreshReadings}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5271ff",
  },
  homeTitle: {
    alignItems: "center",
    minHeight: "70%",
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: 30,
    marginTop: 30,
  },
});

export default HomeScreen;
