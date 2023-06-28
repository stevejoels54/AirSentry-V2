const generateComment = (name: string, value: number): string => {
  switch (name?.toLowerCase()) {
    case "temp":
      if (value < 10) {
        return "Cold";
      } else if (value > 30) {
        return "Hot";
      } else {
        return "Average";
      }
    case "humidity":
      if (value < 30) {
        return "Dry";
      } else if (value > 70) {
        return "Humid";
      } else {
        return "Average";
      }
    case "sound":
      if (value < 50) {
        return "Quiet";
      } else if (value > 80) {
        return "Noisy";
      } else {
        return "Average";
      }
    case "air":
      if (value >= 0 && value <= 100) {
        return "Healthy";
      } else if (value > 100 && value <= 200) {
        return "Moderate";
      } else if (value > 200 && value <= 250) {
        return "Unhealthy For Sensitive Groups";
      } else if (value > 250 && value <= 500) {
        return "Unhealthy";
      } else {
        return "Very Unhealthy";
      }
    default:
      return "";
  }
};

export default generateComment;
