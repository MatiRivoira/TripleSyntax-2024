import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { init } from 'emailjs-com';
init('VO3cmQ8ZsWTmJC-fG');

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  enviarAvisoPendienteAprobacion(usuario: any) {
  
  }

enviarAvisoCuentaAprobada(usuario: any) {
  const templateParams = {
    to_name: usuario.nombre,
    message: `Estimado/a ${usuario.nombre} ${usuario.apellido},

  Nos complace informarle que su solicitud de registro ha sido aceptada con éxito. A continuación, encontrará los detalles de su cuenta:

  Email: ${usuario.email}
  Fecha de Registro: ${this.formatDate(new Date())}

  Si tiene alguna pregunta o necesita asistencia adicional, no dude en ponerse en contacto con nuestro equipo de soporte al cliente.

  ¡Gracias por elegirnos!

  `,
    nombre_restaurante: '✅ Confirmación de Registro Aceptado ✅',
    user_email: usuario.email,
  };

    emailjs
      .send('service', 'aceptado', templateParams)
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
        `Estimado/a ${usuario.nombre} ${usuario.apellido},

Lamentamos informarle que su solicitud de registro no ha sido aceptada en esta ocasión.

Si cree que esto es un error o desea más información, no dude en ponerse en contacto con nuestro equipo de soporte al cliente. Estaremos encantados de ayudarle.

Gracias por su comprensión.

`,
      nombre_restaurante: '❌ Notificación de Registro Rechazado ❌',
      reply_to: usuario.email,
    };

    emailjs
      .send('service', 'rechazado', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }
  formatDate(date:any) {
    const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
}
}
