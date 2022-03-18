import nconf from "nconf";

export const setData = (key: string, value: any) => {
  nconf.set(key, value);
  nconf.save("data.json");
};

export const getData = (key: string) => {
  return nconf.get(key);
};
