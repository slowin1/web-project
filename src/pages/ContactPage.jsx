export default function ContactPage() {
  return (
    <>
      <section className="contact-visual">
      <div className="contact-visual-icon">
        <img src="/contact/icon_1.svg" alt="" />
      </div>
    </section>

    <section className="contact-info">
      <div className="contact-info-row">
        <p>Temporal</p>
        <p className="contact-clock">00:00 EST</p>
      </div>

      <div className="contact-info-row">
        <p>Email для вопросов</p>
        <p>MassageSalon@gmail.com</p>
      </div>

      <div className="contact-info-row">
        <p>Телофон</p>
        <p>+373 123 456</p>
      </div>

      <div className="contact-info-row">
        <p>Техническая поддержка</p>
        <p>MassagesalonTech@gmail.com</p>
      </div>

      <div className="contact-info-row">
        <p>Адрес</p>
        <p>Chishinau , Moldova</p>
      </div>

      <div className="contact-info-row">
        <p>Рекламные предложения</p>
        <p>MassageSalonCollab@gmail.com</p>
      </div>

      <div className="contact-info-row">
        <p>Разработка</p>
        <p>MassagesalonDev@gmail.com</p>
      </div>
    </section>

    <div className="contact-footer">
      <div className="container">
        <p
          className="type-mono"
          data-animate-variant="flicker"
          data-animate-on-scroll="false"
          data-animate-delay="1"
        >
          MWT __ January ’26
        </p>
        <p
          className="type-mono"
          data-animate-variant="flicker"
          data-animate-on-scroll="false"
          data-animate-delay="1"
        >
          [ Engineered by Codegrid ]
        </p>
      </div>
    </div>








    </>
  );
}
