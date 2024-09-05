// const addMeasure = (): void => {
//     const stateCopy = { ...songState };
//     stateCopy[songNameInt].push({});
//     setSongState(stateCopy);
//   };

//   const removeMeasure = (): void => {
//     if (songState[songNameInt].length === 1) return;
//     const stateCopy = { ...songState };
//     stateCopy[songNameInt].pop();
//     setSongState(stateCopy);
//   };

//   const handleRowClick = (rowInt: number): void => {
//     setActiveRow(rowInt);
//   };

//   const handleMeasureClick = (i: number): void => {
//     setActiveMeasure(i);
//   };

//   const pasteMeasure = (): void => {
//     const stateCopy = { ...songState };
//     const finalMeasureIndex = stateCopy[songNameInt].length;
//     const pastedMeasure = createPastedMeasure(
//       copiedMeasure as IMeasureState,
//       finalMeasureIndex
//     );
//     stateCopy[songNameInt].push(pastedMeasure);
//     setSongState(stateCopy);
//   };

//   const copyMeasure = (measureInt: number): void => {
//     const stateCopy = { ...songState };
//     setCopiedMeasure(stateCopy[songNameInt][measureInt]);
//     addToast("Measure copied", "info");
//   };

//   const deleteMeasure = (measureInt: number, songNameInt: number): void => {
//     const stateCopy = { ...songState };
//     const newState = handleDeleteMeasure(measureInt, stateCopy, songNameInt);
//     setSongState(newState);
//     addToast("Measure deleted", "info");
//   };

//   const copyStaffRow = (currentRow: number, songNameInt: number): void => {
//     const stateCopy = { ...songState };
//     const copiedRow = handleCopyStaffRow(currentRow, stateCopy, songNameInt);
//     setCopiedStaffRow(copiedRow);
//   };

//   const pasteStaffRow = (songNameInt: number) => {
//     const stateCopy = { ...songState };
//     try {
//       const newState = handlePasteStaffRow(
//         stateCopy,
//         songNameInt,
//         copiedStaffRow as IMeasureState[]
//       );
//       setSongState(newState);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteStaffRow = (currentRow: number, songNameInt: number): void => {
//     const stateCopy = { ...songState };
//     handleDeleteStaffRow(currentRow, stateCopy, songNameInt);
//     addToast(`Staff row deleted.`, "info");
//   };
// export const createPastedMeasure = (
//     measure: IMeasureState,
//     finalMeasureIndex: number
//   ): IMeasureState => {
//     // We need to iterate over the keys in measure and change the first int in the regex to finalMeasureIndex
//     const pastedMeasure = {} as IMeasureState;
//     const regex = /^(\d+)-(\d+)-(\d+)/;

//     Object.entries(measure).map(([key, fret]) => {
//       const matches = key.match(regex);
//       if (matches) {
//         const stringRegex = matches[2];
//         const timeIntervalRegex = matches[3];
//         const newKey = `${finalMeasureIndex}-${stringRegex}-${timeIntervalRegex}`;
//         pastedMeasure[newKey] = fret;
//       }
//     });
//     return pastedMeasure;
//   };

//   export const handleDeleteMeasure = (
//     measureInt: number,
//     songStateCopy: ISongState,
//     songNameInt: number
//   ): ISongState => {
//     const songArray = songStateCopy[songNameInt];
//     songArray.splice(measureInt, 1);
//     const regex = /^(\d+)-(\d+)-(\d+)/;

//     for (let i = measureInt; i < songArray.length - 1; i++) {
//       const measure = songArray[i];
//       Object.entries(measure).forEach(([key, fret]) => {
//         const matches = key.match(regex);
//         if (matches) {
//           const measureRegex = Number(matches[1]);
//           const stringRegex = matches[2];
//           const timeIntervalRegex = matches[3];
//           const newKey = `${
//             measureRegex - 1
//           }-${stringRegex}-${timeIntervalRegex}`;
//           measure[newKey] = fret;
//           delete measure[key];
//         }
//       });
//     }
//     return songStateCopy;
//   };

//   export const handleCopyStaffRow = (
//     currentRow: number,
//     songStateCopy: ISongState,
//     songNameInt: number
//   ): IMeasureState[] => {
//     const songArray = songStateCopy[songNameInt];
//     let index = currentRow * 4;
//     const results = [];
//     while (results.length < 4) {
//       if (songArray[index] === undefined) break;
//       else {
//         results.push(songArray[index]);
//         index += 1;
//       }
//     }
//     return results;
//   };

//   export const handleDeleteStaffRow = (
//     currentRow: number,
//     songStateCopy: ISongState,
//     songNameInt: number
//   ): ISongState => {
//     const songArray = songStateCopy[songNameInt];
//     const regex = /^(\d+)-(\d+)-(\d+)/;
//     let index = currentRow * 4;
//     let counter = 0;

//     while (counter <= 3) {
//       const measure = songArray[index];
//       if (measure === undefined) break;
//       songArray.splice(index, 1);
//       counter += 1;
//     }

//     while (true) {
//       const measure = songArray[index];
//       if (measure === undefined) break;
//       Object.entries(measure).map(([key, fret]) => {
//         const matches = key.match(regex);
//         if (matches) {
//           const measureRegex = Number(matches[1]);
//           const stringRegex = matches[2];
//           const timeIntervalRegex = matches[3];
//           const newKey = `${
//             measureRegex - counter
//           }-${stringRegex}-${timeIntervalRegex}`;
//           measure[newKey] = fret;
//           delete measure[key];
//         }
//       });
//       index += 1;
//     }
//     return songStateCopy;
//   };

//   export const handlePasteStaffRow = (
//     songStateCopy: ISongState,
//     songNameInt: number,
//     copiedStaffRow: IMeasureState[]
//   ) => {
//     const regex = /^(\d+)-(\d+)-(\d+)/;
//     const songArray = songStateCopy[songNameInt];
//     for (const measure of copiedStaffRow) {
//       if (measure === undefined) continue;
//       const newNote = {} as IMeasureState;
//       Object.entries(measure).map(([key, fret]) => {
//         const matches = key.match(regex);
//         if (matches === undefined || matches === null) return;
//         const stringRegex = matches[2];
//         const timeIntervalRegex = matches[3];
//         const newKey = `${songArray.length}-${stringRegex}-${timeIntervalRegex}`;
//         newNote[newKey] = fret;
//       });
//       songArray.push(newNote);
//     }
//     return songStateCopy;
//   };
