/**
 * Created by Abaddon on 20.11.2016.
 */
"use strict";
//Observers list
const observers = new WeakMap();
//Observers with to be run soon
const queuedObservers = new Set();
//Current running observer
let currentObserver;

// module.exports = {
//     observable
// };

/**
 * Transform object into an observable
 * @param obj
 */
function observable(obj) {
    //Create observers list for object
    observers.set(obj, new Map());
    return new Proxy(obj, {get, set});
}

/**
 * Trap for get operation
 * @param target
 * @param receiver
 * @param field
 */
function get(target, field, receiver) {
    const result = Reflect.get(target, field, receiver);
    if (currentObserver) {
        registerObserver(target, field, currentObserver);
    }
    return result;
}

/**
 * Trap for set operation
 * @param target
 * @param value
 * @param receiver
 * @param field
 */
function set(target, field, value, receiver) {
    const observersForField = observers.get(target).get(field);

    if (observersForField) {
        observersForField.forEach(() => {
            console.log("ololo");
        });
    }

    return Reflect.set(target, field, value, receiver);
}

/**
 * Register observer for object field
 * @param target
 * @param field
 * @param observer
 */
function registerObserver(target, field, observer) {
    //Check has observers for this field
    let observersForField = observers.get(target).get(field);
    if (!observersForField) {
        observersForField = new Set();
        observers.get(target).set(field, observersForField);
    }
    observersForField.add(observer);
}