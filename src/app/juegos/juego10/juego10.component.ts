import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-juego10',
  templateUrl: './juego10.component.html',
  styleUrls: ['./juego10.component.scss'],
})
export class Juego10Component implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConJuego: EventEmitter<any> = new EventEmitter<any>();

  spinner: boolean = false;
  user: any = this.authService.UsuarioActivo;
  listOfCountries: any = [];
  listOfQuestions: any = [];
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  gameOverText: string = '¡PERDISTE!';
  score: number = 0;
  attempts: number = 10;
  currentQuestion: any = null;
  loadedQuestions: boolean = false;
  currentIndex: number = 0;
  correctAnswer: boolean = false;
  wrongAnswer: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async ngOnInit() {
    this.spinner = true;
    await this.getPaises()
      .then((paises) => {
        this.spinner = false;
        this.listOfCountries = paises.map((country: any) => {
          return {
            name: country.translations.spa.official,
            flag: country.flags.png,
          };
        });
        this.startGame();
      })
      .catch((error) => {
        this.spinner = false;
      });
  }

  async getPaises() {
    try {
      const response: any = await fetch('https://restcountries.com/v3.1/all');
      const paises: any = await response.json();
      return paises;
    } catch (error) {
      console.log(error);
    }
  }

  startGame() {
    this.generateQuestions();
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.activeGame = true;
  } // end of startGame

  generateQuestions() {
    this.listOfCountries.sort(() => Math.random() - 0.5);
    this.listOfQuestions = this.listOfCountries
      .slice(0, 10)
      .map((country: any) => {
        const option2 = this.listOfCountries[this.generateRandomNumber()].name;
        const option3 = this.listOfCountries[this.generateRandomNumber()].name;
        const option4 = this.listOfCountries[this.generateRandomNumber()].name;
        const options = [country.name, option2, option3, option4].sort(
          () => Math.random() - 0.5
        );
        return {
          answer: country.name,
          options: options,
          flag: country.flag,
        };
      });
    this.loadedQuestions = true;
  } // end of generateQuestions

  generateRandomNumber() {
    return Math.floor(Math.random() * 249);
  } // end of generateRandomNumber

  play(option: string, event: Event) {
    if (this.activeGame) {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (option === this.currentQuestion.answer) {
        this.score++;
        this.correctAnswer = true;
        setTimeout(() => {
          this.correctAnswer = false;
        }, 300);
        // this.notifyService.showSuccess('¡Adivinaste!', 'Preguntados');
      } else {
        this.wrongAnswer = true;
        setTimeout(() => {
          this.wrongAnswer = false;
        }, 300);
        // this.notifyService.showError(
        //   `No adivinaste!, era ${this.currentQuestion.answer}`,
        //   'Preguntados'
        // );
      }

      if (this.currentIndex < 9) {
        this.currentIndex++;
        setTimeout(() => {
          this.currentQuestion = this.listOfQuestions[this.currentIndex];
        }, 500);
      }

      if (this.attempts > 0) {
        this.attempts--;
        if (this.attempts === 0) {
          this.activeGame = false;
          this.gameOver = true;
          if (this.score >= 4) {
            this.victory = true;
            this.gameOverText = '¡GANASTE!';
            // this.notifyService.showSuccess('GANASTE!', 'Preguntados');
          } else {
            // this.notifyService.showError('¡PERDISTE!', 'Preguntados');
          }

          this.spinner = true;
          setTimeout(() => {
            this.spinner = false;
            if (this.pedidoRecibido.jugo == false) {
              this.pedidoRecibido.jugo = true;
              if (this.victory) {
                this.pedidoRecibido.descuentoJuego = 10;
              } else {
                this.pedidoRecibido.descuentoJuego = 0;
              }
            }
            this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
          }, 1500);
        }
      }
    }
  } // end of play

  restartGame() {
    this.generateQuestions();
    this.currentIndex = 0;
    this.score = 0;
    this.attempts = 10;
    this.activeGame = true;
    this.victory = false;
    this.gameOver = false;
    this.gameOverText = '¡PERDISTE!';
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    // this.notifyService.showInfo('Juego Reiniciado', 'Preguntados');
  } // end of restartGame
}
