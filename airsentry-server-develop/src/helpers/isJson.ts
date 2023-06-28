const isValidJson = (str: string) => {
  try {
    JSON.parse(str);

    return true;
  } catch (e) {
    return false;
  }
};

export default isValidJson;
