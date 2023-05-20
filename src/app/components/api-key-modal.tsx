import { Button } from "antd";
import { CloseSquare, Setting } from "react-iconly";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./delete.module.css";
export default function ApiKeyModal(props: {}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <a
      className={styles.link}
      type="link"
      onClick={(event) => {
        if (location.pathname == "/settings") {
          const tempPathName =
            window.sessionStorage.getItem("tempPathName") ?? "";
          if (tempPathName.length > 0) {
            navigate(tempPathName);
          } else {
            navigate(-1);
          }
        } else {
          window.sessionStorage.setItem(
            "tempPathName",
            location.pathname + location.search
          );
          navigate("/settings");
        }
      }}
    >
      {location.pathname == "/settings" ? (
        <CloseSquare set="curved" primaryColor="var(--nextui-colors-primary)" />
      ) : (
        <Setting set="curved" />
      )}
    </a>
  );
}
