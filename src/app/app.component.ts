import { Component, OnInit, inject } from '@angular/core';
import { MainPageComponent } from "./Components/MainPage/MainPage.component";
import { BusinessSearchComponent } from "./Components/BusinessSearch/BusinessSearch.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainPageComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
constructor(){}ngOnInit(): void {
  }
};
