import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject, timer} from "rxjs";
import {Course} from "../model/course";
import {createHttpObservable} from "./util";
import {delayWhen, map, retryWhen, shareReplay, tap} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

// 38. Store Service Design - What Subject to Use ?
@Injectable({
  providedIn: "root"
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$ : Observable<Course[]> = this.subject.asObservable();

  init(){
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map(res => Object.values(res["payload"]) ),
        shareReplay(),
        retryWhen(errors =>
          errors.pipe(
            delayWhen(() => timer(2000)
            )
          ) )
      ).subscribe(
          (courses: Course[]) => this.subject.next(courses)
    );
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory('ADVANCED');
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category == category))
    );
  }

  // 40. BehaviorSubject Store - Example of Data Modification Operation
  saveCourse(courseId: number, changes: Course): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id = courseId);

    const newCourses = courses.slice(0);
    newCourses[courseIndex] = { ...courses[courseIndex], ...changes };

    this.subject.next(newCourses);

    return fromPromise((fetch(`/api/courses/${courseId}`,{
      method: "PUT",
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    })));
  }

  // 41. Refactoring the Course Component for Using the Store
  selectCourseById(courseId: number){
    return this.courses$
      .pipe(
        map(courses => courses.find((course: Course) => course.id == courseId))
      );
  }

}
