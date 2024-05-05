import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  constructor(private router: Router) {}


  seleccionarDificultad(seleccion :string){



      const navigationExtras: NavigationExtras = {
        queryParams: { dato: seleccion }
      };
      this.router.navigate(['/juego'], navigationExtras);
    

  }

}
