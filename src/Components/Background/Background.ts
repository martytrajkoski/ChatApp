import fallBackground from "../../assets/Profile/fall_background.jpeg";
import winterBackground from "../../assets/Profile/winter_background.jpg";
import springBackground from "../../assets/Profile/spring_background.jpg";
import summerBackground from "../../assets/Profile/summer_background.png";

export const getSeasonBackground = () => {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) {
      return springBackground;
    } else if (month >= 5 && month <= 7) {
      return summerBackground; 
    } else if (month >= 8 && month <= 10) {
      return fallBackground;
    } else {
      return winterBackground;
    }
  };