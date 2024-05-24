import { Component, OnInit } from "@angular/core";
import { Course, CourseCategory as Category } from "../model/course";
import { interval, Observable, of, timer, pipe, throwError } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  filter, withLatestFrom, finalize
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import * as e from "express";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  protected courses$: Observable<Course[]>;
  protected advancedCourses$: Observable<Course[]>;
  protected beginnerCourses$: Observable<Course[]>;
  protected intermediateCourses$: Observable<Course[]>;

  protected coursesAmount$: Observable<number>;
  protected advancedCoursesAmount$: Observable<number>;
  protected beginnerCoursesAmount$: Observable<number>;
  protected intermediateCoursesAmount$: Observable<number>;

  protected title$: Observable<string>;
  protected advancedCoursesTabLabel$: Observable<string>;
  protected beginnerCoursesTabLabel$: Observable<string>;
  protected intermediateCoursesTabLabel$: Observable<string>;

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    this.courses$ = http$.pipe(
      // 27. The Catch and Rethrow RxJs Error Handling Strategy and the finalize Operator
      // catchError(error => {
      //   console.log("Error occurred: " + error);
      //   return throwError(error);
      // }),
      // finalize(() => {
      //   console.log("Finalize executed");
      // }),
      tap(() => {
        console.log("HTTP Request executed");
      }),
      map((response) => Object.values(response["payload"])),
      shareReplay(),
      // 28. The Retry RxJs Error Handling Strategy
      retryWhen(errors => errors.pipe(
        delayWhen(() => timer(2000))
      ))
    );

    this.advancedCourses$ = this.courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(
          (course: Course) => course.category === Category.ADVANCED
        )
      )
    );

    this.beginnerCourses$ = this.courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(
          (course: Course) => course.category === Category.BEGINNER
        )
      )
    );

    this.intermediateCourses$ = this.courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(
          (course: Course) => course.category === Category.INTERMEDIATE
        )
      )
    );

    this.coursesAmount$ = this.courses$.pipe(
      withLatestFrom(courses => courses.length)
    );

    this.advancedCoursesAmount$ = this.advancedCourses$.pipe(
      withLatestFrom(courses => courses.length)
    );

    this.beginnerCoursesAmount$ = this.beginnerCourses$.pipe(
      withLatestFrom(courses => courses.length)
    );

    this.intermediateCoursesAmount$ = this.intermediateCourses$.pipe(
      withLatestFrom(courses => courses.length)
    );

    const labelWithAmount: Function = (label: string, amount = 0) => amount && `${label} (${amount})` || label;

    this.title$ = this.coursesAmount$.pipe(
      withLatestFrom(amount => labelWithAmount("All Courses", amount))
    );

    this.advancedCoursesTabLabel$ = this.advancedCoursesAmount$.pipe(
      withLatestFrom(amount => labelWithAmount(Category.ADVANCED, amount))
    );

    this.beginnerCoursesTabLabel$ = this.beginnerCoursesAmount$.pipe(
      withLatestFrom(amount => labelWithAmount(Category.BEGINNER, amount))
    );

    this.intermediateCoursesTabLabel$ = this.intermediateCoursesAmount$.pipe(
      withLatestFrom(amount => labelWithAmount(Category.INTERMEDIATE, amount))
    );


  }
}
