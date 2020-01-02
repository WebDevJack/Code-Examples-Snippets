/*

  ES6 Throttling the execution of scripts attached to "scroll" DOM events. Drastically reduces load on JS engine, as scroll events 
  can trigger many times on one scroll, E.G on mobile. Throttling limits the amount of times the event can trigger per a set time.
  
  The below combines the throttling concept, with an API that allow elements to be slide on when they are in the window "view" (scroll).

*/

  
let throttling = (someFunc, milliSecs) => {
  // function you want to throttle + time in millisecs
  let time = Date.now();
  return () => {
    if ((time + milliSecs - Date.now()) < 0) {
      someFunc();
      time = Date.now();
    }
  }
}
