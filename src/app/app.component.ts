import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // Add the imports property with RouterOutlet
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'Task Manager';
}