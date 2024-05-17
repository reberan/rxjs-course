import { Component, OnInit } from "@angular/core";
import { interval, merge } from "rxjs";
import { map } from 'rxjs/operators'
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Section 18. Understanding the merge Observable combination strategy.
    // const interval1$ = interval(1000);
    // const interval2$ = interval1$.pipe(map(val => val * 10));
    // const result$ = merge(interval1$, interval2$);
    // result$.subscribe(console.log);

    // Section 21. Unsubscription In Detail - Implementing a Cancellable HTTP Observable
    // const http$ = createHttpObservable('/api/courses');
    // const sub$ = http$.subscribe(console.log);
    // setTimeout(()=> sub$.unsubscribe(),0 );

  }
}
