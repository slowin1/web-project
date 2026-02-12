import { Link } from 'react-router-dom';

export default function Contacts() {
  return (
    <div className="relative isolate min-h-screen bg-transparent">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/texture-background-with-silver-foil-effect.jpg')" }}
      />
      <div className="rain-container fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${Math.random() * 300}%`,
              animationDuration: `${0.1 + Math.random() * 0.6}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.4 + Math.random() * 0.5,
              height: `${30 + Math.random() * 50}px`,
            }}
          />
        ))}
      </div>
      <div className="gradient-canvas fixed inset-0 z-10 pointer-events-none" />

      <header className="relative z-20 flex ps-8 pt-8 pb-2">
        <Link to="/">
          <img src="/logo1.png" alt="Logo" className="h-16 mb-2" />
        </Link>
      </header>

      <nav className="flex flex-col gap-8 relative z-20 ps-8 w-md list-none">
        <li>
          <Link to="/signin" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>
            Sign in
          </Link>
        </li>
        <li>
          <Link to="/services" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>
            Услуги
          </Link>
        </li>
        <li>
          <Link to="/portfolio" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>
            Портфолио
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>
            О нас
          </Link>
        </li>
        <li>
          <Link to="/contacts" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>
            Контакты
          </Link>
        </li>
      </nav>

      <main className="relative z-20 max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-light text-white mb-12 tracking-wide">Контакты</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-sm bg-white/10 p-8 rounded-lg border border-white/20">
            <h2 className="text-2xl font-light text-white mb-6">Свяжитесь с нами</h2>

            <div className="space-y-4 text-gray-200">
              <div>
                <div className="text-sm text-gray-400 mb-1">Телефон</div>
                <a href="tel:+79001234567" className="text-lg hover:text-white transition-colors">
                  +7 (900) 123-45-67
                </a>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Email</div>
                <a href="mailto:info@massagesalon.ru" className="text-lg hover:text-white transition-colors">
                  info@massagesalon.ru
                </a>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Адрес</div>
                <p className="text-lg">г. Москва, ул. Примерная, д. 10</p>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Часы работы</div>
                <p className="text-lg">Пн-Вс: 9:00 - 21:00</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/10 p-8 rounded-lg border border-white/20">
            <h2 className="text-2xl font-light text-white mb-6">Записаться</h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <textarea
                placeholder="Сообщение"
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded text-white transition-colors"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
