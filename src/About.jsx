import { Link } from 'react-router-dom';

export default function About() {
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
        <h1 className="text-5xl font-light text-white mb-12 tracking-wide">О нас</h1>

        <div className="backdrop-blur-sm bg-white/10 p-12 rounded-lg border border-white/20">
          <p className="text-gray-200 text-lg leading-relaxed mb-6">
            Добро пожаловать в наш массажный салон — пространство, где забота о вашем теле и душе становится искусством.
          </p>
          <p className="text-gray-200 text-lg leading-relaxed mb-6">
            Мы работаем с 2015 года и за это время помогли тысячам клиентов обрести гармонию, снять стресс и улучшить самочувствие.
          </p>
          <p className="text-gray-200 text-lg leading-relaxed mb-8">
            Наша команда — это сертифицированные специалисты с многолетним опытом, которые постоянно совершенствуют свои навыки и следят за новыми тенденциями в мире массажа и wellness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-4xl font-light text-white mb-2">8+</div>
              <div className="text-gray-300">лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-white mb-2">5000+</div>
              <div className="text-gray-300">довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-white mb-2">15+</div>
              <div className="text-gray-300">видов массажа</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
