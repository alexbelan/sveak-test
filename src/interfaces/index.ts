export interface News {
  id: number;
  type: "story";
  by: string;
  time: number;
  kids: Array<number>;
  comments?: Array<Comment>;
  url: string;
  score: number;
  title: string;
  descendants: number;
}

export interface Comment {
  id: number;
  type: "comment";
  by: string;
  parent: number;
  text: string;
  kids: Array<number>;
  comments?: Array<Comment>;
  time: number;
}
