import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import classes from "./RootLayout.module.css"
import Footer from "./Footer"


export default function RootLayout(){
    return <>
    <a href="#content" className="skip-link">Към съдържанието</a>
    <div className={classes.shell}>
      <Header />
      <main id="content" tabIndex={-1} className={classes.globalContainer}>
        <Outlet />
      </main>
      <Footer />
    </div>
    </>
}
