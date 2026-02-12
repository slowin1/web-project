import { Link } from 'react-router-dom';

export default function Signin() {
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

      <main className="relative z-20 flex items-center justify-center min-h-[80vh]">
        <div className="backdrop-blur-sm bg-white/10 p-12 rounded-lg border border-white/20 w-full max-w-md">
          <h1 className="text-4xl font-light text-white mb-8 text-center">Вход</h1>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Пароль</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded text-white transition-colors font-light text-lg"
            >
              Войти
            </button>

            <div className="text-center">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Забыли пароль?
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
