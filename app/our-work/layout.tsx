import { ContactDialog } from "../components/ContactDialog";
import { Navigation } from "../components/Navigation";
import { ScrollToTop } from "../components/ScrollToTop";
import { WorkFooter } from "./WorkFooter";
import "./work.css";

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <><Navigation />{children}<WorkFooter /><ContactDialog /><ScrollToTop /></>;
}
