import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[my-cmp]'
})
export class MyCmp {
    constructor(el :ElementRef) {
        el.nativeElement.style.backgroundColor="Red";
    }
}