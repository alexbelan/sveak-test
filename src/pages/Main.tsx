import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./Home"));
const News = lazy(() => import("./News"));

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={"/"}
          element={
            <Suspense>
              <Home />
            </Suspense>
          }
        />
        <Route
          path={":id"}
          element={
            <Suspense>
              <News />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
};

export default Main;
