import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Material from "react-native-vector-icons/MaterialIcons";

interface DeviceCardProps {
  deviceName: string;
  deviceLocation: string;
  onPress: () => void;
}

const DeviceCard = ({
  deviceName,
  deviceLocation,
  onPress,
}: DeviceCardProps) => {
  return (
    <View style={styles.devicesCard}>
      <View style={{ marginRight: 10 }}>
        <Material name="device-thermostat" size={80} color="#5271ff" />
      </View>
      <View>
        <Text style={styles.deviceCardTitle}>{deviceName}</Text>
        <Text style={styles.deviceCardLocation}>{deviceLocation}</Text>
        <TouchableOpacity onPress={onPress} style={styles.deviceCardStatus}>
          <Text style={styles.deviceStatusText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  devicesContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  devicesCard: {
    backgroundColor: "white",
    width: "90%",
    height: 120,
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  deviceCardTitle: {
    fontSize: 25,
    color: "#5271ff",
  },
  deviceCardLocation: {
    fontSize: 18,
    color: "gray",
  },
  deviceCardStatus: {
    display: "flex",
    color: "white",
    fontSize: 16,
    backgroundColor: "#5271ff",
    borderRadius: 50,
    marginTop: 10,
    width: "40%",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  deviceStatusText: {
    color: "white",
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

export default DeviceCard;
