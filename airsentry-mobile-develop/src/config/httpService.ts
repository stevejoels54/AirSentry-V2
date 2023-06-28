import axios from "axios";
import { isEmpty } from "lodash";
import constants from "./constants";

const httpService = {
  setUpInterceptors: () => {
    axios.interceptors.request.use(
      (config) => {
        const localConfig = config;
        // Do something before request is sent

        if (!localConfig.headers["Content-type"])
          localConfig.headers["Content-type"] = "application/json";

        localConfig.headers.Accept = "application/json";
        localConfig.timeout =
          localConfig.timeout === 0 ? 60000 : localConfig.timeout;
        localConfig.baseURL = constants.httpServer;
        return localConfig;
      },
      (error) => Promise.reject(error)
    );
    axios.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        const { config, data } = response;
        // Return entire response if response type blob
        if (config && config.responseType === "blob") return response;
        return response;
      },
      (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        let { response } = error;

        if (!isEmpty(response)) {
          if (response.status === 401) {
            response = {
              data: { server: { message: "Session Expired!" } },
            };
          } else if (response.status === 404) {
            response = {
              data: { server: { message: "Resource not found" } },
            };
          }
        } else {
          response = {
            data: {
              server: {
                message:
                  "Connection Failed, Please check your Internet connection and try again.",
              },
            },
          };
        }
        return Promise.reject(response);
      }
    );
  },
};

export default httpService;
