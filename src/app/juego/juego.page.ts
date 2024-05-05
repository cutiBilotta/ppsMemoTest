import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  constructor(private router: ActivatedRoute) {}

  public dificultad : string ="";
  public arrayImagenes: string[] = [];
  private frutas: string[] = ['arandano', 'anana', 'multi', 'cereza' , 'manzana', 'banana', 'naranja', 'pera','arandano', 'anana', 'multi', 'cereza' , 'manzana', 'banana', 'naranja', 'pera'];
  private animales: string[] = ['flamenco', 'pinguino', 'tortuga','flamenco', 'pinguino', 'tortuga'];
  private herramientas: string[] = ['lapiz', 'engranaje', 'serrucho', 'tijera' , 'herramientas', 'lapiz', 'engranaje', 'serrucho', 'tijera' , 'herramientas'];

  public seleccionRonda: number =0;

  public primeraImagen :string = "";
  public segundaImagen :string = "";

  bloquearImagen: { [nombre: string]: boolean } = {};


  ngOnInit() {

    this.router.queryParams.subscribe(params => {
      this.dificultad = params['dato'];
    });

    this.seleccionarImagenesAleatorias();

  }


  seleccionarImagenesAleatorias() {
    let cantidadElementos: number;
    let array: string[];
    
    switch (this.dificultad) {
      case 'facil':
        cantidadElementos = 6;
        array = this.animales;
        break;
      case 'medio':
        cantidadElementos = 10;
        array = this.herramientas;
        break;
      case 'dificil':
        cantidadElementos = 16;
        array = this.frutas;
        break;
      default:
        console.error('Dificultad no reconocida');
        return;
    }
  
    const indicesGenerados: number[] = []; 
    const arrayAux: string[] = [];
    
    while (arrayAux.length < cantidadElementos) {
      const indiceAleatorio = Math.floor(Math.random() * cantidadElementos);
      if (!indicesGenerados.includes(indiceAleatorio)) {
        indicesGenerados.push(indiceAleatorio);
        arrayAux.push(array[indiceAleatorio]);
      }
    }
  
    console.log("aca");
  
    indicesGenerados.forEach(indice => {
      this.arrayImagenes.push(arrayAux[indice]);
    });
  }
  
     
  seleccionarImagen(nombreImagen: string) {
    this.seleccionRonda++;
  
    if (this.seleccionRonda === 1) {
      this.primeraImagen = nombreImagen;
      console.log(this.seleccionRonda + " - " + nombreImagen);
      this.bloquearImagen[nombreImagen] = true; // Bloquear la imagen seleccionada
    } else if (this.seleccionRonda === 2) {
      this.segundaImagen = nombreImagen;
      console.log(this.seleccionRonda + " - " + nombreImagen);
  
      if (this.primeraImagen === this.segundaImagen) {
        console.log("acertaste");
      } else {
        console.log("perdiste! siguiente ronda");
      }
      this.seleccionRonda = 0;
    }
  }

  }
  





