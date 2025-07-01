import { FC } from "react";
import { Helmet } from "react-helmet-async";

const MetaData: FC = () => {
  return (
    <Helmet>
      <meta property="og:title" content="Soa" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://site-assets.fontawesome.com/releases/v6.5.2/css/all.css"
      />
    </Helmet>
  );
};

export default MetaData;
