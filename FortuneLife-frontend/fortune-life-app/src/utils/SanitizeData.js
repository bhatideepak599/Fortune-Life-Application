export const sanitizedData = ({ data, keysTobeSelected }) => {
  if (Array.isArray(data)) {
    return data.map((item) => sanitizedData({ data: item, keysTobeSelected })).filter(Boolean);
  }

  if (data && typeof data === "object") {
    const resultList = {};

    keysTobeSelected.forEach((element) => {
      if (element.includes(".")) {
        const [firstKey, ...rest] = element.split(".");
        const nestedKey = rest.join(".");

        if (data[firstKey]) {
          const nestedResult = sanitizedData({
            data: data[firstKey],
            keysTobeSelected: [nestedKey],
          });

          Object.assign(resultList, nestedResult);
        }
      } else if (data.hasOwnProperty(element)) {
        resultList[element] = data[element];
      }
    });

    return resultList;
  }
};
