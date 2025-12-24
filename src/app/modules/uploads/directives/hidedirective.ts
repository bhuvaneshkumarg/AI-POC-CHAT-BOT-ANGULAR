import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[hideElement]',
})
export class HideElementDirective {
  @Input() hideElement: boolean;

  @HostBinding('style.display')
  get display() {
    return this.hideElement ? 'none' : 'block';
  }
}