import { FC } from "react";
import { Helmet } from "react-helmet-async";

const Performances: FC = () => {
  return (
    <div>
      <Helmet>
        <title>Performances | Soa</title>
      </Helmet>
      <main className="h-screen flex items-center justify-center">
        <h1 className="~text-sm/2xl">PERFORMANCES</h1>
      </main>
    </div>
  );
};

export default Performances;
