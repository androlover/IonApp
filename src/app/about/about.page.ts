import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // ✅ import this
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-about',
  standalone: true, // ✅ important for standalone component
  imports: [IonicModule], // ✅ add IonicModule here
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage {
   constructor(private router: Router) {

   }

}
