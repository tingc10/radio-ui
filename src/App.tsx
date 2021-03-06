import React from "react";
import styles from "./App.module.scss";
import { DeviceControls } from "./components/DeviceControls";
import { AxiosResponse, AxiosError } from "axios";
import classnames from "classnames";

function App() {
  const [status, setStatus] = React.useState("");
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
  const setTimedStatus = (message: string) => {
    if (timer) {
      clearTimeout(timer);
    }
    setStatus(message);
    setTimer(
      setTimeout(() => {
        setStatus("");
      }, 1500)
    );
  };
  const handleSuccess = (res: AxiosResponse) => {
    setTimedStatus(res.data.message);
  };

  const handleFailure = (error: AxiosError) => {
    console.log(error);
    setTimedStatus("Oh no! Something went wrong...");
  };

  return (
    <div>
      <DeviceControls
        deviceNumber={1}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        label="Bedroom AC"
      />
      <DeviceControls
        deviceNumber={2}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        label="Front Lighthouse"
      />
      <DeviceControls
        deviceNumber={3}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        label="Back Lighthouse"
      />
      <div className={classnames(styles.status, status && styles.show)}>
        {status}
      </div>
    </div>
  );
}

export default App;
