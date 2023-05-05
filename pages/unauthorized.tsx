

import React from "react";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link href="/">
        <span>Back to home</span>
      </Link>
    </div>
  );
};

export default Unauthorized;
