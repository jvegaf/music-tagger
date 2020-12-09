import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { fromEvent, Subscription } from 'rxjs';

// tslint:disable-next-line: directive-selector
@Directive({ selector: 'dui-input' })
export class TextFieldContextMenuDirective implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(private elementRef: ElementRef, private electronService: ElectronService) {
  }

  ngOnInit() {
    const menu = this.buildMenu();
    this._subscription = fromEvent(this.elementRef.nativeElement, 'contextmenu')
      .subscribe((e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        let node: HTMLElement = e.target as HTMLElement;
        while (node) {
          if (node.nodeName.match(/^(dui-input)$/i) || node.isContentEditable) {
            menu.popup({window: this.electronService.remote.getCurrentWindow()});
            break;
          }
          node = node.parentNode as HTMLElement;
        }
      });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private buildMenu() {
    const menu = new this.electronService.remote.Menu();
    const MenuItem = this.electronService.remote.MenuItem;
    menu.append(new MenuItem({role: 'undo'}));
    menu.append(new MenuItem({role: 'redo'}));
    menu.append(new MenuItem({type: 'separator'}));
    menu.append(new MenuItem({role: 'cut'}));
    menu.append(new MenuItem({role: 'copy'}));
    menu.append(new MenuItem({role: 'paste'}));
    menu.append(new MenuItem({type: 'separator'}));
    menu.append(new MenuItem({role: 'selectAll'}));
    return menu;
  }
}
