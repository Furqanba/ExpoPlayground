// import * as SQLite from "expo-sqlite";

// const openDb = async () => {
//   const db = await SQLite.openDatabaseAsync("scanned_data.db");
//   return db;
// };

// export const createTable = async () => {
//   const db = await openDb();
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS scanned_data (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       imageByteArray TEXT,
//       bodyPartName TEXT,
//       bodyPartType TEXT,
//       risk TEXT,
//       assymetry INTEGER,
//       irregularBorders INTEGER,
//       variedColors INTEGER,
//       diameterLargerThanSix INTEGER,
//       selectedSkinColor TEXT,
//       analyzed TEXT,
//       timeStamp INTEGER,
//       isSelected INTEGER,
//       isFromselfExam TEXT
//     );
//   `);
// };

// export const insertData = async (data, successCallback) => {
//   const db = await openDb();
//   await db.runAsync(
//     `INSERT INTO scanned_data (
//       imageByteArray, bodyPartName, bodyPartType, risk, assymetry,
//       irregularBorders, variedColors, diameterLargerThanSix, selectedSkinColor,
//       analyzed, timeStamp, isSelected, isFromselfExam
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       data.imageByteArray,
//       data.bodyPartName,
//       data.bodyPartType,
//       data.risk,
//       data.assymetry ? 1 : 0,
//       data.irregularBorders ? 1 : 0,
//       data.variedColors ? 1 : 0,
//       data.diameterLargerThanSix ? 1 : 0,
//       data.selectedSkinColor,
//       data.analyzed,
//       data.timeStamp,
//       data.isSelected ? 1 : 0,
//       typeof data.isFromselfExam === "boolean"
//         ? data.isFromselfExam
//           ? "1"
//           : "0"
//         : data.isFromselfExam.toString(),
//     ]
//   );
//   successCallback && successCallback();
// };

// export const fetchData = async (callback) => {
//   const db = await openDb();
//   const result = await db.getAllAsync("SELECT * FROM scanned_data");
//   callback && callback(result);
// };

// export const deleteData = async (id, callback) => {
//   const db = await openDb();
//   await db.runAsync("DELETE FROM scanned_data WHERE id = ?", [id]);
//   callback && callback();
// };

// export const updateData = async (id, data, callback) => {
//   const db = await openDb();
//   await db.runAsync(
//     `UPDATE scanned_data SET
//       imageByteArray = ?, bodyPartName = ?, bodyPartType = ?, risk = ?, assymetry = ?,
//       irregularBorders = ?, variedColors = ?, diameterLargerThanSix = ?, selectedSkinColor = ?,
//       analyzed = ?, timeStamp = ?, isSelected = ?, isFromselfExam = ?
//     WHERE id = ?`,
//     [
//       data.imageByteArray,
//       data.bodyPartName,
//       data.bodyPartType,
//       data.risk,
//       data.assymetry ? 1 : 0,
//       data.irregularBorders ? 1 : 0,
//       data.variedColors ? 1 : 0,
//       data.diameterLargerThanSix ? 1 : 0,
//       data.selectedSkinColor,
//       data.analyzed,
//       data.timeStamp,
//       data.isSelected ? 1 : 0,
//       typeof data.isFromselfExam === "boolean"
//         ? data.isFromselfExam
//           ? "1"
//           : "0"
//         : data.isFromselfExam.toString(),
//       id,
//     ]
//   );
//   callback && callback();
// };
import * as SQLite from "expo-sqlite";

const openDb = async () => {
  const db = await SQLite.openDatabaseAsync("scanned_data.db");
  return db;
};

export const createTable = async () => {
  const db = await openDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scanned_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageByteArray TEXT,
      bodyPartName TEXT,
      bodyPartType TEXT,
      risk TEXT,
      assymetry INTEGER,
      irregularBorders INTEGER,
      variedColors INTEGER,
      diameterLargerThanSix INTEGER,
      selectedSkinColor TEXT,
      analyzed TEXT,
      timeStamp INTEGER,
      isSelected INTEGER,
      isFromselfExam TEXT
    );
  `);
};

export const insertData = async (data, successCallback) => {
  const db = await openDb();
  await db.runAsync(
    `INSERT INTO scanned_data (
      imageByteArray, bodyPartName, bodyPartType, risk, assymetry,
      irregularBorders, variedColors, diameterLargerThanSix, selectedSkinColor,
      analyzed, timeStamp, isSelected, isFromselfExam
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.imageByteArray,
      data.bodyPartName,
      data.bodyPartType,
      data.risk,
      data.assymetry ? 1 : 0,
      data.irregularBorders ? 1 : 0,
      data.variedColors ? 1 : 0,
      data.diameterLargerThanSix ? 1 : 0,
      data.selectedSkinColor,
      data.analyzed,
      data.timeStamp,
      data.isSelected ? 1 : 0,
      typeof data.isFromselfExam === "boolean"
        ? data.isFromselfExam
          ? "1"
          : "0"
        : data.isFromselfExam.toString(),
    ]
  );
  successCallback && successCallback();
};

export const fetchData = async (callback) => {
  const db = await openDb();
  const result = await db.getAllAsync("SELECT * FROM scanned_data");
  callback && callback(result);
};

export const deleteData = async (id, callback) => {
  const db = await openDb();
  await db.runAsync("DELETE FROM scanned_data WHERE id = ?", [id]);
  callback && callback();
};

export const updateData = async (id, data, callback) => {
  const db = await openDb();
  await db.runAsync(
    `UPDATE scanned_data SET
      imageByteArray = ?, bodyPartName = ?, bodyPartType = ?, risk = ?, assymetry = ?,
      irregularBorders = ?, variedColors = ?, diameterLargerThanSix = ?, selectedSkinColor = ?,
      analyzed = ?, timeStamp = ?, isSelected = ?, isFromselfExam = ?
    WHERE id = ?`,
    [
      data.imageByteArray,
      data.bodyPartName,
      data.bodyPartType,
      data.risk,
      data.assymetry ? 1 : 0,
      data.irregularBorders ? 1 : 0,
      data.variedColors ? 1 : 0,
      data.diameterLargerThanSix ? 1 : 0,
      data.selectedSkinColor,
      data.analyzed,
      data.timeStamp,
      data.isSelected ? 1 : 0,
      typeof data.isFromselfExam === "boolean"
        ? data.isFromselfExam
          ? "1"
          : "0"
        : data.isFromselfExam.toString(),
      id,
    ]
  );
  callback && callback();
};
