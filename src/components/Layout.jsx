import Nav from "./Nav";

import TransitionGrid from "./TransitionGrid";
import Hamburger from "./Hamburger";

export default function Layout({ children }) {
  return (
    <>
      <TransitionGrid />
      <Nav location="Chishinau, MD" />
      <Hamburger />

      {children}
    </>
  );
}
