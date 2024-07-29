import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-juego15',
  templateUrl: './simonQuince.component.html',
  styleUrls: ['./simonQuince.component.scss'],
})
export class SimonQuinceComponent implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConJuego: EventEmitter<any> = new EventEmitter<any>();
  @Output() volverAtras?: EventEmitter<any> = new EventEmitter<any>();

  colors = ['red', 'blue', 'green', 'yellow'];
  gameStarted = false;
  message = '';
  messageClass = '';
  puntuacion: number = 0;
  victoria:boolean = false;

  sequence: string[] = [];
  playerSequence: string[] = [];
  sequenceIndex = 0;

  constructor(private notificacionesS: NotificacionesService){

  }

  ngOnInit(): void {
    
  }

  volverAlMenu(){
    let scannerTrue = true;
    this.volverAtras.emit(scannerTrue);
  }

  startGame() {
    this.gameStarted = true;
    this.victoria = false;
    this.sequence = [];
    this.message = "";
    this.playerSequence = [];
    this.sequenceIndex = 0;
    this.puntuacion = 0;
    this.notificacionesS.presentToast("¡MIRA LA SECUENCIA!", "success");
    // this.message = '¡MIRA LA SECUENCIA!';
    this.messageClass = '';

    this.generateNextSequence();
    setTimeout(() => {
      this.playSequence();
    }, 1000);
  }

  generateNextSequence() {
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.sequence.push(randomColor);
  }

  playSequence() {
    this.sequenceIndex = 0;
    this.playNextColor();
  }

  playNextColor() {
    const color = this.sequence[this.sequenceIndex];
    console.log(color);
    this.highlightColor(color);
    this.sequenceIndex++;

    if (this.sequenceIndex === this.sequence.length) {
      setTimeout(() => {
        this.notificacionesS.presentToast("¡TU TURNO!", "secondary");
        // this.message = '¡TU TURNO!';
        // this.messageClass = '¡MUY BIEN!';
      }, 1000);
    } else {
      setTimeout(() => {
        this.playNextColor();
      }, 1000);
    }
  }

  highlightColor(color: string) {
    const buttonElement = document.querySelector(`.${color}`);
    let audio:any;
    if(buttonElement != null){
      
      // console.log(buttonElement);
      switch(color)
      {
        case "red":
          audio= new Audio("../../../../assets/rojo.m4a");
          audio.play();
          buttonElement.classList.add(`active-${color}`);
          break;
        case "blue":
          audio= new Audio("../../../../assets/azul.m4a");
          audio.play();
          buttonElement.classList.add(`active-${color}`);
          break;
        case "green":
          audio= new Audio("../../../../assets/verde.m4a");
          audio.play();
          buttonElement.classList.add(`active-${color}`);
          break;
        case "yellow":
          audio= new Audio("../../../../assets/amarillo.m4a");
          audio.play();
          buttonElement.classList.add(`active-${color}`);
          break;
      }
    
      setTimeout(() => {
        buttonElement.classList.remove(`active-${color}`);
      }, 800);
    }
    
  }

  handleButtonClick(color: string) {
    // if (!this.gameStarted || this.sequenceIndex === this.sequence.length) {
    //   console.log(color);
    //   return;
    // }
  
    this.highlightColor(color);
    this.playerSequence.push(color);
  
    if (color !== this.sequence[this.playerSequence.length - 1]) {
      this.notificacionesS.presentToast("¡SE ACABO EL JUEGO!", "danger");
      if(this.puntuacion >= 30)
      {
        this.victoria = true;
        this.message = '¡GANASTE!';
        this.messageClass = 'success';
        this.notificacionesS.presentToast("¡Ganaste. Descuento 15% aplicado!", "success");
      }
      else
      {
        this.message = 'PERDISTE!';
        this.messageClass = 'error';
        this.notificacionesS.presentToast("Perdiste. Descuento 15% no aplicado!", "danger");
      }

      this.notificacionesS.showSpinner();
      try {
        if (this.pedidoRecibido.jugo == false) {
            this.pedidoRecibido.jugo = true;
            if (this.victoria) {
              this.pedidoRecibido.descuentoJuego = 15;
            } else {
              this.pedidoRecibido.descuentoJuego = 0;
            }
          }
          this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
     
      } catch (error) {
        
      }finally{
        this.notificacionesS.hideSpinner();
      }
     
       
 
      
      this.gameStarted = false;
    } else if (this.playerSequence.length === this.sequence.length) {
      if (this.playerSequence.join('') === this.sequence.join('')) {
        this.notificacionesS.presentToast("¡MUY BIEN!", "success");
        this.puntuacion += 10;
        // this.messageClass = 'success';
        this.playerSequence = [];
        setTimeout(() => {
          this.generateNextSequence();
          setTimeout(() => {
            this.playSequence();
          }, 1000);
        }, 1000);
      } else {
        this.gameStarted = false;
      }
    }
  }

}
