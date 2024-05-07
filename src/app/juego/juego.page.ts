import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  @ViewChildren('imagenElemento') imagenElementos!: QueryList<ElementRef>;
 
  constructor(private router: ActivatedRoute, public route : Router) {}

  public dificultad : string ="";
  public arrayImagenes: string[] = [];
  private frutas: string[] = ['arandano', 'anana', 'multi', 'cereza' , 'manzana', 'banana', 'naranja', 'pera','arandano', 'anana', 'multi', 'cereza' , 'manzana', 'banana', 'naranja', 'pera'];
  private animales: string[] = ['flamenco', 'pinguino', 'tortuga','flamenco', 'pinguino', 'tortuga'];
  private herramientas: string[] = ['lapiz', 'engranaje', 'serrucho', 'tijera' , 'herramientas', 'lapiz', 'engranaje', 'serrucho', 'tijera' , 'herramientas'];
  private paresAcertados =0;
  public seleccionRonda: number =0;

  private cronometro:any;
  public primeraImagen :string = "";
  public segundaImagen :string = "";

  public segundos = 0;
  public minutos = 0;
  public indiceAnterior : number=-1;
  elementosImg: HTMLImageElement[] = [];



  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.dificultad = params['dato'];
    });

    this.seleccionarImagenesAleatorias();
  }

  ngAfterViewInit() {
    this.imagenElementos.forEach((elemento: ElementRef) => {
      this.elementosImg.push(elemento.nativeElement as HTMLImageElement);
    });
  
    console.log(this.elementosImg);
  
    Swal.fire({
      html:
        '<br><label style="font-size:80%">Estás listo para comenzar?</label>',
      confirmButtonText: "Siii",
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false
  
    }).then((result) => {
      if (result.isConfirmed) {
        this.iniciarCronometro();
      }
    });
  }
  
  iniciarCronometro() {

    this.cronometro = setInterval(() => {
      this.segundos++;
      if (this.segundos === 60) {
        this.minutos++;
        this.segundos = 0;
      }
      console.log(`${this.minutos}:${this.segundos}`);
    }, 1000); // se ejecuta cada segundo
  
    // Si necesitas detener el cronómetro en algún momento, puedes hacerlo usando clearInterval(cronometro);
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
  
     
  seleccionarImagen(nombreImagen: string, indice: number) {
    this.seleccionRonda++;

    this.elementosImg[indice].src = `../../assets/img/${this.dificultad}/${nombreImagen}.png`, innerHeight=100 , innerWidth=100 ;

    if (this.seleccionRonda === 1) {
        this.primeraImagen = nombreImagen;
        this.indiceAnterior = indice;
    } else if (this.seleccionRonda === 2) {
        this.segundaImagen = nombreImagen;

        if (this.primeraImagen === this.segundaImagen) {
            console.log("acertaste");
            this.paresAcertados ++;
        } else {
            setTimeout(() => {
                this.elementosImg[indice].src = `../../assets/img/q.png`;
                this.elementosImg[this.indiceAnterior].src = `../../assets/img/q.png`;
                console.log("perdiste! siguiente ronda");
            }, 1000); // 2000 milisegundos = 2 segundos
        }

        this.seleccionRonda = 0;
    }

    if(this.paresAcertados== this.arrayImagenes.length/2){

      clearInterval(this.cronometro);
      Swal.fire({
        html: `<br><label style="font-size:80%">Has ganado el juego!</label><br><label style="font-size:80%">En ${this.minutos}:${this.segundos}</label>`,
        confirmButtonText: "Perfecto!",
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigateByUrl('home');
        }
      });

    }
}

  
}





