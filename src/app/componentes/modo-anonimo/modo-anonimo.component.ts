import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-modo-anonimo',
  templateUrl: './modo-anonimo.component.html',
  styleUrls: ['./modo-anonimo.component.scss'],
})
export class ModoAnonimoComponent implements OnInit {
  @Output() activarSpinner: EventEmitter<any> = new EventEmitter<any>();

  //@ts-ignore
  formAnonimo:FormGroup;
  spinner:boolean = false;
  clienteAnonimo:any = {};

  constructor(private formBuilder: FormBuilder, private firestore: FirebaseService, private router: Router)
  {
    this.formAnonimo = this.formBuilder.group({
      nombre: ['', [Validators.required]]});
  }

  ngOnInit() {}

  ingresar()
  {
    if(this.formAnonimo.valid)
    {
      const fecha = new Date().getTime();
      
      this.clienteAnonimo.nombre = this.formAnonimo.value.nombre;
      this.clienteAnonimo.apellido = "";
      this.clienteAnonimo.perfil = "anónimo";
      this.clienteAnonimo.hora = fecha;
      this.clienteAnonimo.id = `${this.clienteAnonimo.nombre}.${this.clienteAnonimo.hora}`;
      this.clienteAnonimo.rutaFoto = "/assets/metre/incognito.png";

      this.activarSpinner.emit();
  
      setTimeout(() => {
        this.firestore.agregarDocumentoAnonimo(this.clienteAnonimo, "usuarios-aceptados");
        this.formAnonimo.reset();
        this.router.navigateByUrl("/inicio-cliente");
      }, 3000);
    }
  } 

}
