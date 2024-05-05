import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { environment } from '../../environments/environment.prod'
firebase.initializeApp(environment.firebaseConfig);


@Injectable({
  providedIn: 'root'
})
export class StorageService {


  storageRef = firebase.app().storage().ref();
  
  async subirImagen(nombre: string, seccion :string, imgBase64: any) {
    try {
      const respuesta = await this.storageRef.child(`relevamiento/${seccion}/${nombre}`).putString(imgBase64, 'data_url');
      console.log(respuesta);
      return await respuesta.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async obtenerImagen(carpeta:string, nombreImg: string) {
    try {
      const url = await this.storageRef.child(carpeta +"/"+ nombreImg).getDownloadURL();
      return url;
    } catch (err) {
      console.log(err);
      return null;
    }
  }


  async obtenerImagenRandomEnCarpeta(carpeta: string): Promise<string> {
    try {
      // Obtener la lista de imágenes en la carpeta
      const listaImagenes = await this.storageRef.child(carpeta).listAll();
      
      // Seleccionar una imagen aleatoria
      const imagenAleatoria = this.obtenerElementoAleatorio(listaImagenes.items);

      // Obtener la URL de la imagen aleatoria
      if (imagenAleatoria) {
        const url = await imagenAleatoria.getDownloadURL();
        return url;
      } else {
        throw new Error('No se encontraron imágenes en la carpeta.');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private obtenerElementoAleatorio<T>(array: T[]): T | undefined {
    const indiceAleatorio = Math.floor(Math.random() * array.length);
    return array[indiceAleatorio];
  }

  async obtenerImagenesEnDirectorio(carpetaPrincipal: string, subdirectorio: string) {
    try {
      // Obtener referencia al directorio
      const directorioRef = this.storageRef.child(`${carpetaPrincipal}/${subdirectorio}`);
  
      // Obtener lista de archivos en el directorio
      const listaArchivos = await directorioRef.listAll();
  
      // Obtener la URL de descarga y metadatos de cada archivo
      const promesasURL = listaArchivos.items.map(async (archivoRef) => {
        const url = await archivoRef.getDownloadURL();
        const metadata = await archivoRef.getMetadata();
        return { url, nombre: archivoRef.name, metadata };
      });
  
      // Esperar a que todas las promesas se resuelvan
      const urlsYMetadatos = await Promise.all(promesasURL);
  
      // Ordenar las imágenes por fecha descendente
      const imagenesOrdenadas = urlsYMetadatos.sort((a, b) => {
        return new Date(b.metadata.timeCreated).getTime() - new Date(a.metadata.timeCreated).getTime();
      });
  
      // Devolver solo las URL de las imágenes ordenadas
      return imagenesOrdenadas;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  
}

