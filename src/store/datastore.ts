import { writeFile, readFile } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname,
  "..",
  "..",
  "..",
  "store",
  "data.json"
);

export const setData = (key: string, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    readFile(file, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const json = JSON.parse(data.toString());
        json[key] = value;
        writeFile(file, JSON.stringify(json), (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }
  );
};

export const getData = (key: string): Promise<any> => {
  // Get data of file or create file
  return new Promise((resolve, reject) => {
    readFile(file, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          writeFile(file, JSON.stringify({}), (err) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(undefined);
            }
          });
        } else {
          console.log(err);
          reject(err);
        }
      } else {
        const json = JSON.parse(data.toString());
        resolve(json[key]);
      }
    });
  }
  );
};