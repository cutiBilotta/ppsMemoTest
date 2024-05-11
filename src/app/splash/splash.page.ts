import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) { }
  ngOnInit() {

    document.addEventListener("DOMContentLoaded", function() {
      setTimeout(function() {
          var appIcon = document.querySelector('.app-icon');
          appIcon!.classList.add('animated');
      }, 2000); // Espera 2 segundos (2000 milisegundos)
  });

    setTimeout(() => {
      this.router.navigateByUrl('/login'); 
    }, 4000);
  }

}
