export interface Course {
  id: number;
  description: string;
  iconUrl: string;
  courseListIcon: string;
  longDescription: string;
  category: CourseCategory;
  lessonsCount: number;
}

export enum CourseCategory {
  BEGINNER = "BEGINNER",
  ADVANCED = "ADVANCED",
  INTERMEDIATE = "INTERMEDIATE"
}
