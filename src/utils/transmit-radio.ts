import axios, { AxiosResponse } from "axios";

let requestInFlight = false;

export function transmitSignal(deviceNumber: number, signal: "on" | "off") {
  if (requestInFlight)
    return Promise.resolve<AxiosResponse>({
      data: { message: "Transmit signal already in flight" },
    } as AxiosResponse);
  requestInFlight = true;

  return axios
    .get("http://raspberrypi:3000/transmit/", {
      params: {
        deviceNumber,
        signal,
      }
    })
    .finally(() => {
      requestInFlight = false;
    });
}
