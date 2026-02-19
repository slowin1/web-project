import { createRoot } from "react-dom/client";
import App from "./App";

import "/globals.css";
import "/css/preloader.css";
import "/css/nav.css";
import "/css/menu.css";
import "/css/index.css";
import "/css/lab.css";
import "/css/work.css";
import "/css/project.css";
import "/css/contact.css";
import "/css/footer.css";
import "/css/login.css";
import "/css/forgot-password.css";

createRoot(document.getElementById("root")).render(<App />);
