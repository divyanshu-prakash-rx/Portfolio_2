import React from "react";

export default function Footer() {
  return (
    <footer className=" pb-4 border-t border-dark-100">
      <div className="text-center pt-3  text-gray-500">
        <p>
          © {new Date().getFullYear()} Divyanshu Prakash. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
