import React from "react";
import { PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import store from "./src/config";
import Screens from "./src/screens";
import httpService from "./src/config/httpService";

httpService.setUpInterceptors();

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <Screens />
      </PaperProvider>
    </StoreProvider>
  );
}
