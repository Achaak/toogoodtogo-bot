import nconf from "nconf";

nconf.file("./.storage/data.json");

export const setData = (key: string, value: any) => {
  nconf.set(key, value);
  nconf.save("data.json");
};

export const getData = (key: string) => {
  return nconf.get(key);
};
