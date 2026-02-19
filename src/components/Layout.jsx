import Nav from "./Nav";
import Hamburger from "./Hamburger";
import TransitionGrid from "./TransitionGrid";

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
