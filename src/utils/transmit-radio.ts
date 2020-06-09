import axios, { AxiosResponse } from "axios";

function hoursToMilliseconds(hours: number) {
  return hours * 60 * 60 * 1000;
}

let requestInFlight = false;
const raspberryIP = "192.168.0.50";

export function transmitSignal(
  deviceNumber: number,
  signal: "on" | "off",
  hours?: number
) {
  if (requestInFlight)
    return Promise.resolve<AxiosResponse>({
      data: { message: "Transmit signal already in flight" },
    } as AxiosResponse);
  requestInFlight = true;

  return axios
    .get(`http://${raspberryIP}:3000/transmit/`, {
      params: {
        deviceNumber,
        signal,
        timeout: hours && hoursToMilliseconds(hours),
      },
    })
    .finally(() => {
      requestInFlight = false;
    });
}

export function setTimedOperation(deviceNumber: number, hours: number) {
  return transmitSignal(deviceNumber, "on", hours);
}
