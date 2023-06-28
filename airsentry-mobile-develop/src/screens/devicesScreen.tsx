import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../config/actions/actions";
import { isEmpty, map, toString } from "lodash";
import DeviceCard from "../components/deviceCard";

const DevicesScreen = ({ navigation }) => {
  const viewDeivce = (deviceCode: string, _id: string) => {
    navigation.navigate("Home", { deviceCode, deviceId: _id });
    dispatch(actions.getLatestReadings(deviceCode));
    dispatch(actions.getDeviceDetails(_id));
  };
  const { devices } = useSelector((state: any) => state.rootReducer);
  const dispatch = useDispatch();

  const refreshDevices = () => {
    dispatch(actions.getDevices());
  };

  useEffect(() => {
    dispatch(actions.getDevices());
  }, []);

  useEffect(() => {
    if (!isEmpty(devices?.devicesError.data)) {
      const { data } = devices?.devicesError || {};
      Alert.alert(toString(data?.server?.message));
    }
  }, [devices.devicesError]);
  return (
    <View style={styles.mainContainer}>
      <View style={{ backgroundColor: "#5271ff" }}>
        <View style={styles.titleContainer}>
          <Image
            style={styles.titleContainerImage}
            source={require("../../assets/Logo.png")}
          />
          <Text style={styles.titleText}>Air Sentry</Text>
        </View>
      </View>
      <View style={{ backgroundColor: "white" }}>
        <View style={styles.devicesContainer}>
          <Text style={styles.devicesTitle}>Your Devices</Text>
          <ScrollView
            refreshControl={
              <RefreshControl
                colors={["white"]}
                refreshing={devices.devicesLoading}
                onRefresh={refreshDevices}
              />
            }
            style={{ width: "100%" }}
          >
            {devices.devicesLoading ? (
              <Text style={styles.devicesTitle}>Loading Your Devices...</Text>
            ) : (
              <>
                <View style={styles.devicesContent}>
                  {map(devices.devices, (device, index) => (
                    <DeviceCard
                      key={index}
                      deviceName={device.deviceName}
                      deviceLocation={device.deviceLocation}
                      onPress={() => viewDeivce(device.deviceCode, device._id)}
                    />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: "100%",
    alignItems: "center",
    width: "100%",
    backgroundColor: "red",
  },
  titleContainer: {
    minHeight: "50%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    borderBottomLeftRadius: 70,
    flexDirection: "column",
  },
  titleContainerImage: {
    marginTop: -50,
    height: 300,
    width: 300,
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5271ff",
    marginTop: -80,
  },
  devicesContainer: {
    flex: 1,
    backgroundColor: "#5271ff",
    minWidth: "100%",
    borderTopRightRadius: 70,
  },
  devicesContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  devicesTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
});

export default DevicesScreen;
