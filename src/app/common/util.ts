import { Observable } from "rxjs";

export const createHttpObservable: Function = (url: URL): Observable<any> => {
  return new Observable((subscriber) => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(url, {signal})
      .then((response) => response.json())
      .then((json) => {
        subscriber.next(json);
        subscriber.complete();
      })
      .catch((error) => {
        subscriber.error(error);
      });
    return () => controller.abort();
  });
};

export const createSimpleObserver: Function = (): {
  next: Function;
  error: Function;
  complete: Function;
} => {
  return {
    next: (value: any) => {
      console.log(value);
    },
    error: (error: Error) => {
      console.error(error);
    },
    complete: () => {
      console.info("completed!");
    },
  };
};
