import { useEffect, useState, type ReactElement } from "react";
import CourseList from "../components/shared/CourseList";
import CategoryList from "../components/shared/CategoryList";
import { Course, CourseDetails } from "../components/shared/types";
import CourseDetailsCard from "../components/shared/CourseDetails";

type SceneDataMap = {
  none: undefined;
  list: Course[];
  details: CourseDetails;
  categories: string[];
};

type ActiveScene<T extends keyof SceneDataMap> = {
  type: T;
  data: SceneDataMap[T];
};

export type ActiveSceneType = ActiveScene<keyof SceneDataMap>;

export interface SceneManager {
    activeScene: keyof SceneDataMap;
    renderScene: () => ReactElement | null;
}

export interface SceneManagerReturnType {
  sceneManager: SceneManager;
  setActiveScene: (scene: ActiveSceneType) => void;
}

export const useSceneManager = (): SceneManagerReturnType => {
  const [activeScene, setActiveScene] = useState<ActiveSceneType>({
    type: "none",
    data: undefined,
  });

  useEffect(() => {
    console.log('activeScene', activeScene);
  }, [activeScene]);

  const renderScene = (): ReactElement | null => {
    if (activeScene.type === "list") {
      return (
        <CourseList
          courses={activeScene.data as Course[]}
          onSelect={(id) => null}
        />
      );
    }

    if (activeScene.type === "categories" && activeScene.data) {
      return <CategoryList categories={activeScene.data as string[]} />;
    }

    if (activeScene.type === "details" && activeScene.data) {
      return <CourseDetailsCard course={activeScene.data as CourseDetails} />;
    }

    return null; // or a welcome screen / loader
  };

  return {
    sceneManager: {
      activeScene: activeScene.type,
      renderScene,
    },
    setActiveScene,
  };
};
