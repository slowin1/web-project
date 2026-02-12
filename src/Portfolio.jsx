import { Link } from 'react-router-dom';

export default function Portfolio() {
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

      <main className="relative z-20 max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-light text-white mb-12 tracking-wide">Портфолио</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 overflow-hidden group">
              <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 group-hover:scale-105 transition-transform" />
              <div className="p-4">
                <h3 className="text-white font-light">Работа #{item}</h3>
                <p className="text-gray-300 text-sm">Массаж и процедуры</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
