
import React from "react";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist or has been removed.</p>
      <Link href="/" passHref>
        <span>Back to home</span>
      </Link>
    </div>
  );
};

export default Custom404;
