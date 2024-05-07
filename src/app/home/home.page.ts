import { Component, OnInit} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {


  constructor(private router: Router,  private afAuth : AngularFireAuth) {}
  public userEmail : string|null=null;

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        console.log("null");
      }
    });
  }

  cerrarSesion(){

    this.afAuth.signOut();
    this.router.navigateByUrl('login');
  }
  
  seleccionarDificultad(seleccion :string){



      const navigationExtras: NavigationExtras = {
        queryParams: { dato: seleccion }
      };
      this.router.navigate(['/juego'], navigationExtras);
    

  }

}
