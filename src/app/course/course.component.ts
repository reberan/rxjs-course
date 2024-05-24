import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, filter, throttle, throttleTime
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, interval } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from "../common/util";


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: number;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true, read: ElementRef }) input: ElementRef;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
        this.lessons$ = this.loadLessons();
    }

    ngAfterViewInit() {
      const searchLessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
        .pipe(
          map(event => event.target.value),
          // 30. RxJs Throttling vs Debouncing
          // throttle(() => interval(500)),
          // or
          // throttleTime(500),

          // 29. The startWith RxJs Operator - Simplifying the Course Component
          startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(search => this.loadLessons(search))
        );
      const initialLessons$ = this.loadLessons();
      this.lessons$ = concat(initialLessons$, searchLessons$);
    }

    loadLessons(search= ''): Observable<Lesson[]>{
      return createHttpObservable(
        `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(response => response["payload"]),
        );
    }
}
