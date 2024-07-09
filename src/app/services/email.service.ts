import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { init } from 'emailjs-com';
init('W9r-wAJwdvg44ww5g');

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  enviarAvisoPendienteAprobacion(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Para poder acceder a tu cuenta debes esperar que sea aprobada. Por favor ten paciencia.',
      from_name: 'La mano de Dios Bodegon',
      reply_to: usuario.email,
    };

    emailjs
      .send('service_9ct5d8o', 'template_nn095tr', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }

enviarAvisoCuentaAprobada(usuario: any) {
  const templateParams = {
    to_name: usuario.nombre,
    message: `
      Tu cuenta ha sido aprobada, ya puedes ingresar a la aplicación.
    `,
    from_name: 'La Mano de Dios Bodegon',
    reply_to: usuario.email,
  };

    emailjs
      .send('service_1l4gkns', 'template_y5llrna', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }

  enviarAvisoCuentaDeshabilitada(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Tu cuenta ha sido deshabilitada, por favor comunicate con nosotros para saber las causas.',
      from_name: 'La mano de Dios Bodegon',
      reply_to: usuario.email,
    };

    emailjs
      .send('service_1l4gkns', 'template_y5llrna', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }
}
