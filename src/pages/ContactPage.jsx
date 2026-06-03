import { useEffect, useState } from "react";
import { CONTENT_TYPES, contentItemsAPI } from "../api/contentItems";

const FALLBACK_CONTACT_ROWS = [
  { id: "time", title: "Temporal", subtitle: "00:00 EST", isActive: true },
  { id: "questions", title: "Email для вопросов", subtitle: "MassageSalon@gmail.com", isActive: true },
  { id: "phone", title: "Телефон", subtitle: "+373 123 456", isActive: true },
  { id: "support", title: "Техническая поддержка", subtitle: "MassagesalonTech@gmail.com", isActive: true },
  { id: "address", title: "Адрес", subtitle: "Chisinau, Moldova", isActive: true },
  { id: "collab", title: "Рекламные предложения", subtitle: "MassageSalonCollab@gmail.com", isActive: true },
  { id: "dev", title: "Разработка", subtitle: "MassagesalonDev@gmail.com", isActive: true },
];

export default function ContactPage() {
  const [contactRows, setContactRows] = useState(FALLBACK_CONTACT_ROWS);

  useEffect(() => {
    let isMounted = true;

    async function loadContacts() {
      try {
        const data = await contentItemsAPI.getPublic(CONTENT_TYPES.contact);
        const activeRows = data.filter((item) => item.isActive);
        if (isMounted && activeRows.length > 0) {
          setContactRows(activeRows);
        }
      } catch (error) {
        console.error("Contact content load error:", error);
      }
    }

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("contact:rows-updated"));
  }, [contactRows]);

  return (
    <>
      <section className="contact-visual">
        <div className="contact-visual-icon">
          <img src="/contact/icon_1.svg" alt="" />
        </div>
      </section>

      <section className="contact-info">
        {contactRows.map((row) => (
          <div className="contact-info-row" key={row.id || row.title} data-contact-source="true">
            <p>{row.title}</p>
            <p className={row.id === "time" ? "contact-clock" : undefined}>{row.subtitle}</p>
          </div>
        ))}
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
            [ Engineered by Славик Нагорянский ]
          </p>
        </div>
      </div>
    </>
  );
}
