import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector:'[my-directive]'
})

export class MyDirective{
    constructor(elemRef:ElementRef){
        elemRef.nativeElement.style.backgroundColor='blue';
        // elemRef.nativeElement.style.font="consolas";
        // elemRef.nativeElement.font="consolas";

    }
}