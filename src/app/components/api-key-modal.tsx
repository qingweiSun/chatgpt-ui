import { Button } from "antd";
import { CloseSquare, Setting } from "react-iconly";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./delete.module.css";
export default function ApiKeyModal(props: {}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Button
      className={styles.link}
      type="link"
      onClick={(event) => {
        if (location.pathname == "/settings") {
          history.back();
        } else {
          navigate("/settings");
        }
      }}
    >
      {location.pathname == "/settings" ? (
        <CloseSquare set="curved" primaryColor="var(--nextui-colors-primary)" />
      ) : (
        <Setting set="curved" />
      )}
    </Button>
  );
}
