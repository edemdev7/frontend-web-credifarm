import { FC } from "react";
import { Helmet } from "react-helmet-async";

const Communications: FC = () => {
  return (
    <div>
      <Helmet>
        <title>Communications | Soa</title>
      </Helmet>
      <main className="h-screen flex items-center justify-center">
        <h1 className="~text-sm/2xl">COMUNICATIONS</h1>
      </main>
    </div>
  );
};

export default Communications;
