import { useEffect } from "react";
import { useDispatch } from "react-redux";
import actions from "../../config/actions/actions";

const useGetTrendsInsights = ({
  mode,
  deviceId,
  deviceCode,
  sensorId,
  trendPeriod,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "Air Quality") {
      dispatch(
        actions.getTrends(
          deviceCode,
          `air-quality?deviceId=${deviceId}`,
          trendPeriod
        )
      );
    } else
      dispatch(
        actions.getTrends(deviceCode, `/sensors/${sensorId}`, trendPeriod)
      );
  }, [sensorId, mode, dispatch, deviceCode, deviceId]);

  //   useEffect(() => {
  //     if (isEmpty(insights)) {
  //       if (mode === "Air Quality") {
  //         dispatch(actions.getInsights(deviceCode, `${deviceId}`, trendPeriod));
  //       } else
  //         dispatch(
  //           actions.getInsights(deviceCode, `/sensors/${sensorId}`, trendPeriod)
  //         );
  //     }
  //   }, [sensorId, mode, dispatch, deviceCode, deviceId]);
};

export default useGetTrendsInsights;
