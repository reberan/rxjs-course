import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from 'rxjs/operators';
import {concat, forkJoin, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from "../common/util";
import {debug, RxJsLoggingLevel, setRxJsLoggingLevel} from "../common/debug";


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
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
          .pipe(
            // 31 & 32. Implementing a Custom RxJs Operator - the debug Operator
            debug(RxJsLoggingLevel.INFO, "course value")
          );
        this.lessons$ = this.loadLessons();
        // 31 & 32. Implementing a Custom RxJs Operator - the debug Operator
        setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);

        // 33. The RxJs forkJoin Operator - In-Depth Explanation and Practical Example
        forkJoin(this.course$, this.lessons$)
          .pipe(
            tap(([courses, lessons]) => {
              console.log('forkJoin:');
              console.log('courses -> ', courses);
              console.log('lessons -> ', lessons);
            })
          ).subscribe();
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
          // 31 & 32. Implementing a Custom RxJs Operator - the debug Operator
          debug(RxJsLoggingLevel.TRACE, "search "),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(search => this.loadLessons(search)),
          // 31 & 32. Implementing a Custom RxJs Operator - the debug Operator
          debug(RxJsLoggingLevel.DEBUG, "lessons value ")
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
