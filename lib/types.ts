export type Pixel = {
  x: number;
  y: number;
  color: string;
  userId: string;
  username: string;
  timestamp: number;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  pixelsPlaced: number;
  color: string;
  status: string;
};