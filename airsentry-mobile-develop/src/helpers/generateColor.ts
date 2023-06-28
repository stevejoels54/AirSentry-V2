const generateColor = (name: string, value: number): string => {
  switch (name?.toLowerCase()) {
    case "temp":
      if (value < 10) {
        return "#00BFFF"; // blue
      } else if (value > 30) {
        return "#FF4500"; // orange
      } else {
        return "#8A8A8A"; // gray
      }
    case "humidity":
      if (value < 30) {
        return "#FFD700"; // gold
      } else if (value > 70) {
        return "#1E90FF"; // dodgerblue
      } else {
        return "#8A8A8A"; // gray
      }
    case "sound":
      if (value < 50) {
        return "#32CD32"; // limegreen
      } else if (value > 80) {
        return "#FF4500"; // orange
      } else {
        return "#8A8A8A"; // gray
      }
    case "air":
      if (value >= 0 && value <= 100) {
        return "#43d043"; // limegreen
      } else if (value > 100 && value <= 200) {
        return "#FFD700"; // gold
      } else if (value > 200 && value <= 250) {
        return "#FF4500"; // orange
      } else if (value > 250 && value <= 500) {
        return "#FF0000"; // red
      } else {
        return "#8A8A8A"; // gray
      }
    default:
      return "#8A8A8A"; // gray
  }
};

export default generateColor;
