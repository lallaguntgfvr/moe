import { StrictMode, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./components/Layout";
import { navigation, type PageId } from "./data";

export function mountPage(page: PageId, content: ReactElement) {
  // Keep bookmarks from the old single-page version working.
  const oldAnchor = window.location.hash.slice(1);
  const destination = navigation.find((item) => item.id === oldAnchor);
  if (destination && destination.id !== page) {
    window.location.replace(
      new URL(destination.file, window.location.href).href,
    );
    return;
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Layout page={page}>{content}</Layout>
    </StrictMode>,
  );
}
