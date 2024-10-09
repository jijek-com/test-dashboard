import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isCollapsed = false;

  constructor(private router: Router) {}

  isCurrentRoute(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
