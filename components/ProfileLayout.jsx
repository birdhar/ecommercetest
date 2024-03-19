import React from "react";
import style from "../styles/ProfileLayout.module.css";
import Sidebar from "./Sidebar";
import Layout from "./Layout";

function ProfileLayout({ children }) {
  return (
    <Layout>
      <div className={style.profilelayout}>
        <Sidebar />
        {children}
      </div>
    </Layout>
  );
}

export default ProfileLayout;
