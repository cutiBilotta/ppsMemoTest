import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../service/database.service';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  constructor(private database: DatabaseService) { }

  listaMejoresJugadores: any[] = [];

  ngOnInit() {
    this.obtenerDatosMejoresJugadores();
  }

  obtenerDatosMejoresJugadores() {
    this.database.obtenerTodos('mejores-jugadores').then(firebaseResponse => {
      firebaseResponse?.subscribe(listaUsuariosRef => {
        this.listaMejoresJugadores = listaUsuariosRef.map(usuarioRef => {
          let usuario: any = usuarioRef.payload.doc.data();
          usuario['id'] = usuarioRef.payload.doc.id;
          return usuario;
        });

        this.obtenerMejoresJugadores();
      });
    });
  }

  obtenerMejoresJugadores() {
    // Ordenar la lista de jugadores por tiempo de menor a mayor
    this.listaMejoresJugadores.sort((a, b) => {
      const tiempoA = this.parseTiempo(a.tiempo);
      const tiempoB = this.parseTiempo(b.tiempo);
      return tiempoA - tiempoB;
    });

    // Mantener solo los cinco mejores jugadores
    this.listaMejoresJugadores = this.listaMejoresJugadores.slice(0, 5);
  }

  // Función para convertir el formato de tiempo "0:4" a segundos
  parseTiempo(tiempoString: string): number {
    const [minutos, segundos] = tiempoString.split(':').map(Number);
    return minutos * 60 + segundos;
  }
}

