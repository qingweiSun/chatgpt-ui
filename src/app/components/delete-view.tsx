import { Button, Grid, Popover, Row, Text } from "@nextui-org/react";
import styles from "./delete.module.css";
import { ReactNode, useState } from "react";
import { PopoverPlacement } from "@nextui-org/react/types/popover/utils";

export function SelectView(props: {
  onDelete: () => void;
  title: string;
  description: string;
  placement?: PopoverPlacement;
  className?: string;
  children: ReactNode;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Popover
      placement={props.placement}
      isBordered
      offset={16}
      isOpen={showDelete}
      onOpenChange={(isOpen) => {
        setShowDelete(isOpen);
      }}
    >
      <Popover.Trigger>
        <a
          className={props.className || styles.delete}
          onClick={() => {
            setShowDelete(true);
          }}
        >
          {props.children}
        </a>
      </Popover.Trigger>
      <Popover.Content>
        <DeleteView
          onDelete={() => {
            props.onDelete();
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
          title={props.title}
          description={props.description}
        />
      </Popover.Content>
    </Popover>
  );
}

export function SelectButtonView(props: {
  onDelete: () => void;
  title: string;
  description: string;
  placement?: PopoverPlacement;
  className?: string;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Popover
      placement={props.placement}
      isBordered
      offset={16}
      isOpen={showDelete}
      onOpenChange={(isOpen) => {
        setShowDelete(isOpen);
      }}
    >
      <Popover.Trigger>
        <Button
          bordered
          className={styles.historyItem}
          color="primary"
          onPress={() => {
            setShowDelete(true);
          }}
          css={{
            color: "var(--nextui-colors-error)",
            borderWidth: 1,
            margin: "0 12px",
            fontWeight: 400,
            flex: "0 0 auto",
            justifyContent: "start",
            backdropFilter: "blur(4px)",
            display: "unset",
            borderStyle: "dashed",
            borderColor: "var(--nextui-colors-error)",
            "&:hover": {
              borderColor: "var(--nextui-colors-primary)",
              color: "var(--nextui-colors-primary)",
              fontWeight: 500,
            },
          }}
        >
          清理全部
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <DeleteView
          onDelete={() => {
            props.onDelete();
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
          title={props.title}
          description={props.description}
        />
      </Popover.Content>
    </Popover>
  );
}
export const DeleteView = (props: {
  onDelete: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}) => {
  return (
    <Grid.Container
      css={{ borderRadius: "14px", padding: "0.75rem", width: "220px" }}
    >
      <Row justify="center" align="center">
        <Text b>{props.title}</Text>
      </Row>
      <Row justify="center" align="center">
        <div style={{ padding: 16 }}>
          <Text>{props.description}</Text>
        </div>
      </Row>
      <Row justify="flex-end" align="center">
        <Button size="sm" light auto onPress={props.onCancel}>
          取消
        </Button>
        <div style={{ width: 8 }} />
        <Button size="sm" shadow color="error" auto onPress={props.onDelete}>
          确定
        </Button>
      </Row>
    </Grid.Container>
  );
};
