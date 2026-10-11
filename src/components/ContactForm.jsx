import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

const EMPTY_VALUES = { name: '', email: '', message: '' };

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Escribe tu nombre.';
  }

  if (!values.email.trim()) {
    errors.email = 'Escribe tu correo.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Escribe un correo válido, por ejemplo nombre@dominio.cl.';
  }

  if (!values.message.trim()) {
    errors.message = 'Escribe tu mensaje.';
  } else if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Tu mensaje debe tener al menos ${MIN_MESSAGE_LENGTH} caracteres.`;
  }

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setIsSent(false);
    if (Object.keys(errors).length > 0) {
      setErrors(validate(nextValues));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSent(false);
      return;
    }

    setIsSent(true);
    setValues(EMPTY_VALUES);
  };

  const fieldClass = (field) =>
    `form-control contact-input${errors[field] ? ' is-invalid' : ''}`;

  return (
    <section
      id="contacto"
      className="contact section"
      aria-labelledby="contact-heading"
    >
      <div className="container-fluid">
        <h2 id="contact-heading" className="h4 section-title">
          Contacto
        </h2>
        <p className="contact-intro text-white-50">
          ¿Tienes dudas o sugerencias? Escríbenos y te responderemos a la brevedad.
        </p>

        <form
          className="contact-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="contact-name">
                Nombre
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className={fieldClass('name')}
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
              />
              {errors.name && (
                <p id="contact-name-error" className="contact-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="contact-email">
                Correo
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className={fieldClass('email')}
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
              />
              {errors.email && (
                <p id="contact-email-error" className="contact-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="contact-message">
                Mensaje
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                className={fieldClass('message')}
                value={values.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message && (
                <p id="contact-message-error" className="contact-error" role="alert">
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          <div className="contact-actions">
            <button type="submit" className="btn btn-pay contact-submit">
              Enviar mensaje
            </button>
            {isSent && (
              <p className="contact-success" role="status">
                <i className="bi bi-check-circle-fill me-1" aria-hidden="true" />
                ¡Gracias! Recibimos tu mensaje y te contactaremos pronto.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
