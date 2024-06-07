import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
  BehaviorSubject, AsyncSubject, ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
      // 35. What are RxJS Subjects ? A Simple Explanation
      console.log('Subject');
      const subject1 = new Subject();
      const series1$ = subject1.asObservable();
      series1$.subscribe(console.log);
      subject1.next(1);
      subject1.next(2);
      subject1.next(3);
      subject1.complete();
      console.log('-----');

      // 36. BehaviorSubjects In Detail - When to Use it and Why ?
      console.log('BehaviorSubject');
      const subject2 = new BehaviorSubject(0);
      const series2$ = subject2.asObservable();
      series2$.subscribe(val => console.log("early sub: ", val));
      subject2.next(1);
      subject2.next(2);
      subject2.next(3);
      // late subscriber will not receive values
      subject2.complete();

      setTimeout(() => {
        series2$.subscribe(val => console.log("late sub: ", val));
        subject2.next(4);
      },3000);
      console.log('-----');

      // 37. AsyncSubject and ReplaySubject - Learn the Differences
      console.log('AsyncSubject');
      const subject3 = new AsyncSubject();
      const series3$ = subject3.asObservable();
      series3$.subscribe(val => console.log("first sub: ", val));
      subject3.next(1);
      subject3.next(2);
      subject3.next(3);
      subject3.complete();

      setTimeout(() => {
        series3$.subscribe(val => console.log("second sub: ", val));
        subject3.next(4);
      },3000);
      console.log('-----');

      console.log('ReplaySubject');
      const subject4 = new ReplaySubject();
      const series4$ = subject4.asObservable();
      series4$.subscribe(val => console.log("first sub: ", val));
      subject4.next(1);
      subject4.next(2);
      subject4.next(3);
      subject4.complete();

      setTimeout(() => {
        series4$.subscribe(val => console.log("second sub: ", val));
        subject4.next(4);
      },3000);
      console.log('-----');


    }


}






