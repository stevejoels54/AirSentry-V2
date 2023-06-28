import { Alert } from "react-native";
import { useEffect } from "react";
import { isEmpty, toString } from "lodash";

const useShowError = ({ error }) => {
  useEffect(() => {
    if (!isEmpty(error.data)) {
      const { data } = error || {};
      Alert.alert(toString(data?.server?.message), data?.message);
    }
  }, [error]);
};

export default useShowError;
