import * as React from "react";
import { AxiosResponse, AxiosError } from "axios";
import { transmitSignal } from "../utils/transmit-radio";
import styles from "./styles.module.scss";

interface Props {
  deviceNumber: number;
  onSuccess?: (res: AxiosResponse) => void;
  onFailure?: (error: AxiosError) => void;
}

export const DeviceControls: React.SFC<Props> = ({
  deviceNumber,
  onSuccess,
  onFailure,
}) => {
  function handleClickOn() {
    transmitSignal(deviceNumber, "on")
      .then((res) => {
        onSuccess && onSuccess(res);
      })
      .catch((err) => {
        onFailure && onFailure(err);
      });
  }

  function handleClickOff() {
    transmitSignal(deviceNumber, "off")
      .then((res) => {
        onSuccess && onSuccess(res);
      })
      .catch((err) => {
        onFailure && onFailure(err);
      });
  }

  return (
    <div className={styles.container}>
      <h1>Device #{deviceNumber}</h1>
      <button className={styles.on} onClick={handleClickOn}>
        On
      </button>
      <button className={styles.off} onClick={handleClickOff}>
        Off
      </button>
    </div>
  );
};
