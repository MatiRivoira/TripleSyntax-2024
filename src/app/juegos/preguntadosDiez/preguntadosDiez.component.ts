import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { HttpClient } from '@angular/common/http';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-juego10',
  templateUrl: './preguntadosDiez.component.html',
  styleUrls: ['./preguntadosDiez.component.scss'],
})
export class PreguntadosDiezComponent implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConJuego: EventEmitter<any> = new EventEmitter<any>();
  @Output() volverAtras?: EventEmitter<any> = new EventEmitter<any>();

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

  constructor(private http: HttpClient, private authService: AuthService, private notificacionesS: NotificacionesService) { }

  async ngOnInit() {
    this.notificacionesS.showSpinner();
    await this.getPaises()
      .then((paises) => {
        this.notificacionesS.hideSpinner();
        this.listOfCountries = paises.map((country: any) => {
          return {
            name: country.translations.spa.official,
            flag: country.flags.png,
          };
        });
        this.startGame();
      })
      .catch((error) => {
        this.notificacionesS.hideSpinner();
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
  }
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
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 249);
  }

  volverAlMenu(){
    let scannerTrue = true;
    this.volverAtras.emit(scannerTrue)
  }

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

      } else {
        this.wrongAnswer = true;
        setTimeout(() => {
          this.wrongAnswer = false;
        }, 300);
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
            this.gameOverText = '¡GANASTE UN DESCUENTO DEL 10%!';
            this.notificacionesS.presentToast('Ganaste, se le aplicara un descuento del 10%!', 'success', 'thumbs-up-outline');
          }
          else{
            this.notificacionesS.presentToast('Perdiste! :(', 'danger');
          }

          this.notificacionesS.showSpinner();
          try {
            if (this.pedidoRecibido.jugo == false) {
              this.pedidoRecibido.jugo = true;
              if (this.victory) {
                this.pedidoRecibido.descuentoJuego = 10;
                console.log("entre gane");

              } else {
                this.pedidoRecibido.descuentoJuego = 0;
                console.log("entre perdi");

              }
            }
            setTimeout(() => {
              this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
            }, 1500);

          } catch (error) {

          } finally {
            this.notificacionesS.hideSpinner();
          }

        }
      }
    }
  }

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

  }
}