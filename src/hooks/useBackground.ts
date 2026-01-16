import useLocalStorage from "./useLocalStorage";
import type { BackgroundImage } from "../types";
import { backgroundImages } from "../services/background";

export const useBackground = () => {
  const [currentBg, setCurrentBg] = useLocalStorage<BackgroundImage>(
    "background",
    backgroundImages[0]
  );

  return { currentBg, setCurrentBg, backgroundImages };
};
