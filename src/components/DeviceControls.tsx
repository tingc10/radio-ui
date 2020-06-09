import * as React from "react";
import { AxiosResponse, AxiosError } from "axios";
import { transmitSignal, setTimedOperation } from "../utils/transmit-radio";
import styles from "./styles.module.scss";
import { ReactComponent as Timer } from "./timer.svg";
import classnames from "classnames";

enum Views {
  Default = "default",
  CommonTimers = "common_timers",
  CustomTimer = "custom_timer",
}

interface CustomTimerProps {
  onClickClose: () => void;
  onClickConfirm: (hours: number) => void;
}

const CustomTimer: React.SFC<CustomTimerProps> = ({
  onClickClose,
  onClickConfirm,
}) => {
  const [customTimer, setCustomTimer] = React.useState(1);
  function handleChangeCustomTimer(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value);
    if (isNaN(value) || value < 0) {
      setCustomTimer(0);
    }
    setCustomTimer(value);
  }

  function handleClickConfirm() {
    onClickConfirm(customTimer);
  }

  return (
    <>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="number"
          onChange={handleChangeCustomTimer}
          value={customTimer}
        />{" "}
        hrs
      </div>
      <button
        className={classnames(styles.on, styles.check)}
        onClick={handleClickConfirm}
      >
        &#10003;
      </button>
      <button
        className={classnames(styles.off, styles.close)}
        onClick={onClickClose}
      >
        &times;
      </button>
    </>
  );
};

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
  const [currentView, setCurrentView] = React.useState(Views.Default);

  function resolvePromise(promise: ReturnType<typeof transmitSignal>) {
    promise
      .then((res) => {
        onSuccess && onSuccess(res);
      })
      .catch((err) => {
        onFailure && onFailure(err);
      });
  }

  function handleClickOn() {
    resolvePromise(transmitSignal(deviceNumber, "on"));
  }

  function handleClickOff() {
    resolvePromise(transmitSignal(deviceNumber, "off"));
  }

  function selectTimer(hours: number) {
    resolvePromise(setTimedOperation(deviceNumber, hours));
    setCurrentView(Views.Default);
  }

  function handleClickTimer() {
    setCurrentView(Views.CommonTimers);
  }

  function handleClickCustom() {
    setCurrentView(Views.CustomTimer);
  }

  function closeTimerView() {
    setCurrentView(Views.Default);
  }

  const DefaultButtons = () => {
    return (
      <>
        <button className={styles.timer} onClick={handleClickTimer}>
          <Timer />
        </button>
        <button className={styles.on} onClick={handleClickOn}>
          On
        </button>
        <button className={styles.off} onClick={handleClickOff}>
          Off
        </button>
      </>
    );
  };

  const CommonTimers = () => {
    return (
      <>
        <button className={styles.timer} onClick={() => selectTimer(1)}>
          1hr
        </button>
        <button className={styles.timer} onClick={() => selectTimer(2)}>
          2hrs
        </button>
        <button className={styles.timer} onClick={() => selectTimer(4)}>
          4hrs
        </button>
        <button className={styles.timer} onClick={() => selectTimer(8)}>
          8hrs
        </button>
        <button className={styles.timer} onClick={handleClickCustom}>
          ...
        </button>
        <button
          className={classnames(styles.off, styles.close)}
          onClick={closeTimerView}
        >
          &times;
        </button>
      </>
    );
  };

  const RenderButtons = () => {
    switch (currentView) {
      case Views.CommonTimers:
        return <CommonTimers />;
      case Views.CustomTimer:
        return (
          <CustomTimer
            onClickClose={closeTimerView}
            onClickConfirm={selectTimer}
          />
        );
      case Views.Default:
      default:
        return <DefaultButtons />;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Device #{deviceNumber}</h1>
      <div className={styles.buttonContainer}>
        <RenderButtons />
      </div>
    </div>
  );
};
