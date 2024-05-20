import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../service/database.service';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

    listaMejoresJugadoresDificil: any[] = [];
    listaMejoresJugadoresMedio: any[] = [];
    listaMejoresJugadoresFacil: any[] = [];
  
    constructor(private database: DatabaseService) { }
  
    ngOnInit() {
      this.obtenerDatosMejoresJugadores();
    }
  
    obtenerDatosMejoresJugadores() {
      this.database.obtenerTodos('mejores-jugadores').then(firebaseResponse => {
        firebaseResponse?.subscribe(listaUsuariosRef => {
          const todosLosJugadores = listaUsuariosRef.map(usuarioRef => {
            let usuario: any = usuarioRef.payload.doc.data();
            usuario['id'] = usuarioRef.payload.doc.id;
            return usuario;
          });
  
          this.filtrarMejoresJugadoresPorDificultad(todosLosJugadores, 'dificil', this.listaMejoresJugadoresDificil);
          this.filtrarMejoresJugadoresPorDificultad(todosLosJugadores, 'medio', this.listaMejoresJugadoresMedio);
          this.filtrarMejoresJugadoresPorDificultad(todosLosJugadores, 'facil', this.listaMejoresJugadoresFacil);
        });
      });
    }
  
    filtrarMejoresJugadoresPorDificultad(jugadores: any[], dificultad: string, listaDestino: any[]) {
      const jugadoresFiltrados = jugadores.filter(jugador => jugador.dificultad === dificultad);
      jugadoresFiltrados.sort((a, b) => this.parseTiempo(a.tiempo) - this.parseTiempo(b.tiempo));
      listaDestino.splice(0, listaDestino.length, ...jugadoresFiltrados.slice(0, 5));
    }
  
    parseTiempo(tiempoString: string): number {
      const [minutos, segundos] = tiempoString.split(':').map(Number);
      return minutos * 60 + segundos;
    }
  
    obtenerNombreUsuario(correo: string): string {
      return correo.split('@')[0];
    }
  }

