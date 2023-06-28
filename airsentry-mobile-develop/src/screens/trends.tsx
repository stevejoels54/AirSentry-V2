import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import IntroTitle from "../components/introTitle";
import actions from "../config/actions/actions";
import { map } from "lodash";
import LineGraph from "../components/LineGraph";
import PeriodButton from "../components/periodButton";
import MonthCircularProgress from "../components/MonthCircularProgress";
import useShowError from "../components/hooks/useShowError";
import useGetTrendsInsights from "../components/hooks/useGetTrendsInsights";

const TrendsScreen = () => {
  const {
    trends,
    trendsLoading,
    trendsError,
    insights,
    insightsLoading,
    insightsError,
  } = useSelector((state: any) => state.rootReducer);

  const dispatch = useDispatch();
  const { deviceCode, period, sensorId, mode, deviceId } = useRoute<
    RouteProp<{
      trensds: {
        deviceCode: string;
        sensorId: string;
        mode: string;
        period: string;
        deviceId: string;
      };
    }>
  >().params;
  const [trendPeriod, setTrendPeriod] = useState(period);

  const changePeriod = (period: string) => {
    if (mode === "Air Quality") {
      dispatch(
        actions.getTrends(
          deviceCode,
          `air-quality?deviceId=${deviceId}`,
          period
        )
      );
    } else {
      dispatch(actions.getTrends(deviceCode, `/sensors/${sensorId}`, period));
    }
    setTrendPeriod(period);
  };

  useGetTrendsInsights({
    deviceCode,
    sensorId,
    mode,
    deviceId,
    trendPeriod,
  });
  useShowError({ error: trendsError });
  useShowError({ error: insightsError });
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.containerTitle}>
        {trends?.sensor?.sensorName || "Air Quality"} Trends
      </Text>
      <View style={styles.periodContainer}>
        {map(
          [
            { periodValue: "day", periodName: "Daily" },
            { periodValue: "week", periodName: "Weekly" },
            { periodValue: "month", periodName: "Monthly" },
          ],
          (item) => (
            <PeriodButton
              key={item.periodValue}
              trendPeriod={trendPeriod}
              changePeriod={changePeriod}
              periodValue={item.periodValue}
              periodName={item.periodName}
            />
          )
        )}
      </View>
      {trendsLoading ? (
        <View style={{ marginTop: 30 }}>
          <IntroTitle title="Air Sentry" subtitle="Loading Trends..." />
        </View>
      ) : (
        <>
          <View style={styles.circularProgressContainer}>
            {trendPeriod === "month" && (
              <MonthCircularProgress
                periodAverage={trends?.periodAverage}
                color={"blue"}
                units={trends?.units || trends?.sensor?.units}
              />
            )}
          </View>
          {trendPeriod !== "month" && (
            <View style={styles.graphContainer}>
              <LineGraph
                labels={map(trends.sensorTrends, "name")}
                data={map(trends.sensorTrends, "average")}
              />
            </View>
          )}
        </>
      )}

      <View style={styles.insightsContainer}>
        {insightsLoading ? (
          <View>
            <Text style={styles.insightsTitle}>Loading Insights...</Text>
          </View>
        ) : (
          <>
            {trendPeriod !== "month" && (
              <Text style={styles.insightsTitle}>Today's Insights</Text>
            )}
            <ScrollView>
              {map(insights?.insights || [], (insight, idx) => {
                return (
                  <View key={idx} style={styles.insightsCard}>
                    <Text style={styles.insightsCardTitle}>
                      {insight?.insight_title}
                    </Text>
                    <Text style={styles.insightsCardText}>
                      {insight?.insight}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#5271ff",
    paddingTop: 60,
  },
  containerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  periodContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  periodButton: {
    color: "white",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
  graphContainer: {
    backgroundColor: "#5271ff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  circularProgressContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  insightsContainer: {
    backgroundColor: "#fff",
    flex: 1,
    borderTopRightRadius: 70,
    borderTopLeftRadius: 70,
    marginTop: 30,
  },
  insightsTitle: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
  },
  insightsCard: {
    margin: 20,
  },
  insightsCardTitle: {
    fontSize: 20,
    textAlign: "center",
  },
  insightsCardText: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
    textAlign: "center",
  },
});

export default TrendsScreen;
