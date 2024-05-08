import { Component, OnInit } from "@angular/core";
import { Course, CourseCategory as Category } from "../model/course";
import { interval, Observable, of, timer, pipe } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  filter,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import * as e from "express";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  protected advancedCourses$: Observable<Course[]>;
  protected beginnerCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$: Observable<Course[]> = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      map((response) => Object.values(response["payload"]))
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(
          (course: Course) => course.category === Category.ADVANCED
        )
      )
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter(
          (course: Course) => course.category === Category.BEGINNER
        )
      )
    );
  }
}
