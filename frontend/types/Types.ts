export type Category = {
  _id: string;
  name: string;
  icon: string;
};

export type Lesson = {
  _id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isLocked: boolean;
};

export type Section = {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

export type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  lessonCount: number;
  totalDuration: string;
  teacherId: string | Teacher;
  categoryId: string;
  thumbnail: string;
  benefits: string[];
  sections: Section[];
  resources: string[];
  isInspirational: boolean;
  createdAt: string;
  updatedAt: string;
};


export type Teacher = {
  _id: string;
  name: string;
  job: string;
  profilePicture: string;
  bio: string;
  location: string;
  courseCount: number;
  rating: number;
  reviewCount: number;
};


export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  job: string;
  phone: string;
  savedCourses: (string | Course)[];
  cart: (string | Course)[];
};

export type EnrollmentStatus = "ONGOING" | "COMPLETED";

export type Enrollment = {
  _id: string;
  userId: string;
  courseId: string | Course;
  enrollmentDate: string;
  progress: number;
  status: EnrollmentStatus;
};

export type Answer = {
  _id: string;
  userId: string | User;
  content: string;
  likes: number;
  createdAt: string;
};

export type Question = {
  _id: string;
  userId: string | User;
  courseId: string | Course;
  content: string;
  likes: number;
  createdAt: string;
  answers: Answer[];
};

export type Project = {
  _id: string;
  courseId: string | Course;
  userId: string | User;
  fileName: string;
  title: string;
  createdAt: string;
};

export type Review = {
  _id: string;
  userId: string | User;
  courseId: string | Course;
  rating: number;
  comment: string;
  dateTime: string;
};

export type counts = {
  saved: number;
  ongoing: number;
  completed: number;
};
