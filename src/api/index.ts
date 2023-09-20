import axios from "axios";
import { BASE_API_URL } from "../config";

export const getItemApi = async (id: number) => {
  try {
    const story = await axios.get(`${BASE_API_URL}/item/${id}.json`);
    return story.data;
  } catch (error) {
    console.error("[ERROR GET ITEM]", error);
  }
};

export const getNewsApi = async () => {
  try {
    const { data: storyIds } = await axios.get(
      `${BASE_API_URL}/newstories.json`
    );
    const stories = await Promise.all(storyIds.slice(0, 100).map(getItemApi));
    return stories;
  } catch (error) {
    console.error("[ERROR GET NEWS]", error);
  }
};
