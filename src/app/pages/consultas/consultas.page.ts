import { AuthService } from 'src/app/servicios/auth.service';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/servicios/chat.service';
import { MesasService } from 'src/app/servicios/mesas.service';
@Component({
  selector: 'app-chat-consulta',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
})
export class ConsultasPage implements OnInit {
  mensajes:any[];
  mensaje:string;
  chatroom = 'mensajes-pps4a';
  
  
  //NUEVO
  mesas:any;
  mesaParaVer:any;
  //////

  constructor(public mesasSrv:MesasService,
    public router:Router,
    public chatService: ChatService,
    public authService:AuthService) 
  {
    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnInit() {
   
    this.chatService.cargarMensajes();

    //NUEVOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    this.mesasSrv.traerMesasOcupadas().subscribe((mesasOcupadas)=>{
      this.mesas = mesasOcupadas;
      this.mesaParaVer = "mesa " + mesasOcupadas[0]['numero'];
      console.log(this.mesaParaVer);
    })
    ////////////////////////////////////////////////////
  }

  //NUEVOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
  mesaSeleccionada(numeroMesa:any)
  {
    this.mesaParaVer = "mesa " + numeroMesa;
    console.log(this.mesaParaVer);
  }

  ////////////////////////////////////////////////////



  atras()
  {
    if(this.authService.UsuarioActivo.value.perfil == "cliente")
    {
      this.router.navigate(['menu-mesa'])
    }
    else
    {
      this.router.navigate(['home-mozo'])
    }
  }

  //NUEVOOOOOOOOOOOOOOOOOOOOOO
  enviarMensaje()
  {
    let nombre ="";
    let mesaQueSeLeEnviaMensaje="";
    let nuevoMensaje = {};
    if(this.authService.UsuarioActivo.value.perfil == "empleado")
    {
      nombre = this.authService.UsuarioActivo.value.nombre;
      mesaQueSeLeEnviaMensaje = this.mesaParaVer;
    }
    else
    {
      nombre = this.authService.UsuarioActivo.value.mesaQueEstaUtilizando;
    }
    console.log(this.authService.UsuarioActivo.value.uid)
    

    if(mesaQueSeLeEnviaMensaje == "")
    {
      console.log("entro primer if")
      nuevoMensaje=
      {
        uid:this.authService.UsuarioActivo.value.uid,
        nombre : nombre,
        texto : this.mensaje,
      }
    }
    else
    {
      console.log("entro segundo if")
      nuevoMensaje=
      {
        uid:this.authService.UsuarioActivo.value.uid,
        nombre : nombre,
        texto : this.mensaje,
        mesaQueSeLeEnviaMensaje : mesaQueSeLeEnviaMensaje,
      }
    }    
    
    this.chatService.agregarMensaje(nuevoMensaje)
    this.mensaje='';
  }
  ////////////////////////////////
}

