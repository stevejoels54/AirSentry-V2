import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

interface IntroTitleProps {
  title: string;
  subtitle: string;
}

const IntroTitle = ({ title, subtitle }: IntroTitleProps) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  titleContainer: {
    marginBottom: 30,
  },
});

export default IntroTitle;
