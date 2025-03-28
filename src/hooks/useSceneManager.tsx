import { useEffect, useState, type ReactElement } from "react";
import CourseList from "../components/shared/CourseList";
import CourseCard from "../components/shared/CourseCard";
import CategoryList from "../components/shared/CategoryList";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration?: string;
  syllabus?: string[];
  highlights?: string[];
}

type SceneDataMap = {
  none: undefined;
  list: Course[];
  details: Course;
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
      return <CourseCard course={activeScene.data as Course} />;
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
