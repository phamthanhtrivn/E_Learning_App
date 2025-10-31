export type Category = {
  _id: string;
  name: string;
  icon: string;
};

export type Course = {
  _id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  lessonCount: number;
  thumbnail: string;
  teacher: {
    name: string;
  };
};

export type Teacher = {
  _id: string;
  name: string;
  job: string;
  profilePicture: string;
  rating: string;
  reviewCount: number;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  job: string;
  phone: string;
  savedCourses: string[];
};