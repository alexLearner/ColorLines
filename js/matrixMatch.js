function matchInMatrix(matrix, matchCount, fieldName) {
  const matrixLength = matrix.length;
  let result;

  function findInRow(matrix, rowIndex, colIndex) {
    let
      prevColor = "",
      colorSumIndex = 0,
      result = "";

    for (let index = 0; index < matrixLength; index++) {
      let elem;

      if (colIndex !== undefined) {
        elem = matrix[index] && matrix[index][colIndex];
      } else {
        elem = matrix[rowIndex] && matrix[rowIndex][index];
      }

      if (elem) {
        if (prevColor === elem[fieldName]) {
          colorSumIndex++
        } else {
          prevColor = elem[fieldName];
          colorSumIndex = 0;
        }

      } else {
        colorSumIndex = 0;
        prevColor = "";
      }

      if (colorSumIndex > matchCount - 2) {
        result = {
          cellX: colIndex !== undefined ? colIndex : index,
          cellY: rowIndex !== undefined ? rowIndex : index,
          isOrientByX: colIndex === undefined,
          sumIndex: colorSumIndex,
        }
      }
    }

    return result;
  }

  for (let i = 0; i < matrixLength; i++) {
    result = findInRow(matrix, undefined, i) || findInRow(matrix, i, undefined);

    if (result) {
      return result;
    }
  }
};
