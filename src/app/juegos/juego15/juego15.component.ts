import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-juego15',
  templateUrl: './juego15.component.html',
  styleUrls: ['./juego15.component.scss'],
})
export class Juego15Component implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConJuego: EventEmitter<any> = new EventEmitter<any>();

  spinner: boolean = false;
  startButtonText: string = 'Comenzar Juego';
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  textGameOver: string = '¡PERDISTE!';
  cardImage: string = '../../../../assets/mayor menor/blanca.png';
  cardList: any = [
    { type: 'trebol', number: 1 },
    { type: 'trebol', number: 2 },
    { type: 'trebol', number: 3 },
    { type: 'trebol', number: 4 },
    { type: 'trebol', number: 5 },
    { type: 'trebol', number: 6 },
    { type: 'trebol', number: 7 },
    { type: 'trebol', number: 8 },
    { type: 'trebol', number: 9 },
    { type: 'trebol', number: 10 },
    { type: 'trebol', number: 11 },
    { type: 'trebol', number: 12 },
    { type: 'trebol', number: 13 },
    { type: 'diamante', number: 1 },
    { type: 'diamante', number: 2 },
    { type: 'diamante', number: 3 },
    { type: 'diamante', number: 4 },
    { type: 'diamante', number: 5 },
    { type: 'diamante', number: 6 },
    { type: 'diamante', number: 7 },
    { type: 'diamante', number: 8 },
    { type: 'diamante', number: 9 },
    { type: 'diamante', number: 10 },
    { type: 'diamante', number: 11 },
    { type: 'diamante', number: 12 },
    { type: 'diamante', number: 13 },
    { type: 'corazon', number: 1 },
    { type: 'corazon', number: 2 },
    { type: 'corazon', number: 3 },
    { type: 'corazon', number: 4 },
    { type: 'corazon', number: 5 },
    { type: 'corazon', number: 6 },
    { type: 'corazon', number: 7 },
    { type: 'corazon', number: 8 },
    { type: 'corazon', number: 9 },
    { type: 'corazon', number: 10 },
    { type: 'corazon', number: 11 },
    { type: 'corazon', number: 12 },
    { type: 'corazon', number: 13 },
    { type: 'pica', number: 1 },
    { type: 'pica', number: 2 },
    { type: 'pica', number: 3 },
    { type: 'pica', number: 4 },
    { type: 'pica', number: 5 },
    { type: 'pica', number: 6 },
    { type: 'pica', number: 7 },
    { type: 'pica', number: 8 },
    { type: 'pica', number: 9 },
    { type: 'pica', number: 10 },
    { type: 'pica', number: 11 },
    { type: 'pica', number: 12 },
    { type: 'pica', number: 13 },
  ];
  cardsToGuess: any = [];
  score: number = 0;
  attempts: number = 10;
  currentCard: any = null;
  currentNumber: number = 0;
  currentIndex: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  startGame() {
    this.attempts = 10;
    this.victory = false;
    this.activeGame = true;
    this.gameOver = false;
    this.textGameOver = '¡PERDISTE!';
    this.score = 0;
    this.currentIndex = 0;
    this.startButtonText = 'Reiniciar Juego';
    this.cardList.sort(() => Math.random() - 0.5);
    this.cardsToGuess = this.cardList.slice(0, 11);
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../../assets/mayor menor/${this.currentCard.type}_${this.currentCard.number}.png`;
    // this.notifyService.showInfo('Juego Iniciado', 'Mayor o Menor');
  } // end startGame

  playMayorMenor(mayorMenor: string) {
    const previousNumber: number = this.currentNumber;
    this.currentIndex++;
    this.attempts--;
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../../assets/mayor menor/${this.currentCard.type}_${this.currentCard.number}.png`;

    switch (mayorMenor) {
      case 'menor':
        if (previousNumber > this.currentNumber) {
          this.score++;
          /* this.notifyService.showSuccess(
            '¡Adivinaste, es MENOR!',
            'Mayor o Menor'
          );*/
        } else if (previousNumber === this.currentNumber) {
          //  this.notifyService.showInfo('¡SON IGUALES!', 'Mayor o Menor');
        } else {
          // this.notifyService.showError('¡NO adivinaste!', 'Mayor o Menor');
        }
        break;
      case 'mayor':
        if (previousNumber < this.currentNumber) {
          this.score++;
          /*this.notifyService.showSuccess(
            '¡Adivinaste, es MAYOR!',
            'Mayor o Menor'
          );*/
        } else if (previousNumber === this.currentNumber) {
          //  this.notifyService.showInfo('¡SON IGUALES!', 'Mayor o Menor');
        } else {
          // this.notifyService.showError('¡NO adivinaste!', 'Mayor o Menor');
        }
        break;
    }

    if (this.currentIndex === 10) {
      this.activeGame = false;
      this.gameOver = true;
      if (this.score >= 5) {
        this.victory = true;
        this.textGameOver = '¡GANASTE!';
        this.spinner = true;
        setTimeout(() => {
          this.spinner = false;
          if (this.pedidoRecibido.jugo == false) {
            this.pedidoRecibido.jugo = true;
            if (this.victory) {
              this.pedidoRecibido.descuentoJuego = 15;
            } else {
              this.pedidoRecibido.descuentoJuego = 0;
            }
          }
          this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
        }, 1500);
        //  this.notifyService.showSuccess('¡GANASTE!', 'Mayor o Menor');
      } else {
        this.spinner = true;
        setTimeout(() => {
          this.spinner = false;
          if (this.pedidoRecibido.jugo == false) {
            this.pedidoRecibido.jugo = true;
            if (this.victory) {
              this.pedidoRecibido.descuentoJuego = 15;
            } else {
              this.pedidoRecibido.descuentoJuego = 0;
            }
          }
          this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
        }, 1500);
        //this.notifyService.showError('¡PERDISTE!', 'Mayor o Menor');
      }
      this.createResult();
    }
  } // end of playMayorMenor

  createResult() {
    let date = new Date();
    let currentDate = date.toLocaleDateString();
  } // end of createResult
}