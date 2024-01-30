import { writeFile, readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '..', '..', 'store', 'data.json');

export const setData = <T>(key: string, value: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    readFile(file, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const json = JSON.parse(data.toString()) as Record<string, T>;
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
  });
};

export const getData = <T>(key: string): Promise<T | undefined> => {
  // Get data of file or create file
  return new Promise((resolve, reject) => {
    readFile(file, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
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
        const json = JSON.parse(data.toString()) as Record<string, T>;
        resolve(json[key]);
      }
    });
  });
};
