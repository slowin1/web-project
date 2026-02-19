import Nav from "./Nav";
import Hamburger from "./Hamburger";

export default function Layout({ children }) {
  return (
    <>
      <Nav location="Chishinau, MD" />
      <Hamburger />
      {children}
    </>
  );
}
