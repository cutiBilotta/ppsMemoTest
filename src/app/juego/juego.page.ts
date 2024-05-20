import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { DatabaseService } from '../service/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  @ViewChildren('imagenElemento') imagenElementos!: QueryList<ElementRef>;
 
  constructor(private router: ActivatedRoute, public route : Router, public database : DatabaseService, private afAuth : AngularFireAuth) {}

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
  bloquearImagen: boolean = false;

  public segundos = 0;
  public minutos = 0;
  public indiceAnterior : number=-1;
  elementosImg: HTMLImageElement[] = [];
  private userEmail:string | null = "";

  colSize: string="";
  colHeight: string="";


  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.dificultad = params['dato'];
    });

    this.seleccionarImagenesAleatorias();

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        console.log("null");
      }
    });

    this.updateLayout();


  }

  updateLayout() {
    switch (this.dificultad) {
      case 'facil':
        this.colSize = '6';
        this.colHeight = '25vh';
        break;
      case 'medio':
        this.colSize = '6';
        this.colHeight = '15vh';
        break;
      case 'dificil':
        this.colSize = '3';
        this.colHeight = '15vh';
        break;
      default:
        this.colSize = '3';
        this.colHeight = '15vh';
    }
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

    this.elementosImg[indice].src = `../../assets/img/${this.dificultad}/${nombreImagen}.png`;

    if (this.seleccionRonda === 1) {
        this.primeraImagen = nombreImagen;
        this.indiceAnterior = indice;
    } else if (this.seleccionRonda === 2) {
        this.bloquearImagen = true;
        this.segundaImagen = nombreImagen;

        if (this.primeraImagen === this.segundaImagen) {
            console.log("acertaste");
            this.paresAcertados++;
            this.bloquearImagen = false;

        } else {
            setTimeout(() => {
                this.elementosImg[indice].src = `../../assets/img/q.png`;
                this.elementosImg[this.indiceAnterior].src = `../../assets/img/q.png`;
                console.log("perdiste! siguiente ronda");

                // Desbloquear todas las imágenes después de que termine el setTimeout
                this.bloquearImagen = false;
            }, 1000); // 1000 milisegundos = 1 segundo
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

      let fecha = new Date();

      let desdeStr = `${('0'+fecha.getDate()).slice(-2)}-${('0'+(fecha.getMonth()+1)).slice(-2)}-${fecha.getFullYear()}`;
      const jugador =  { correo : this.userEmail, tiempo : this.minutos + ":" + this.segundos , desdeStr , dificultad: this.dificultad }

      this.database.crear('mejores-jugadores', jugador );
    }
}
generateRows(array: any[]): any[][] {
  const rows = [];
  for (let i = 0; i < array.length; i += 6) {
    rows.push(array.slice(i, i + 6));
  }
  return rows;
}

abandonar(){
  clearInterval(this.cronometro);

  Swal.fire({
    title: "Has abandonado el juego!",
    imageUrl: "../../assets/img/medio.png",
    imageWidth: 130,
    imageHeight: 100,
    heightAuto: false,
    confirmButtonText: "Ir al Home!",
    confirmButtonColor: 'var(--ion-color-primary)',
  }).then((result) => {
    if (result.isConfirmed) {
      this.route.navigateByUrl('home');
    }
  });

  
}

  
}





