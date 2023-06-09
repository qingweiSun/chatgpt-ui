import { Button, Grid, Popover, Row, Text } from "@nextui-org/react";
import styles from "./delete.module.css";
import { ReactNode, useState } from "react";
import { PopoverPlacement } from "@nextui-org/react/types/popover/utils";
import { useMediaQuery } from "react-responsive";

export function SelectView(props: {
  onDelete: () => void;
  title: string;
  description: string;
  placement?: PopoverPlacement;
  className?: string;
  children: ReactNode;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

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
          isDarkMode={isDarkMode}
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
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

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
            opacity: isDarkMode ? 0.6 : 0.8,
            margin: "0 12px",
            fontWeight: 400,
            height: 38,
            flex: "0 0 auto",
            justifyContent: "start",
            backdropFilter: "blur(4px)",
            display: "unset",
            borderStyle: "dashed",
            borderColor: "var(--nextui-colors-error)",
            "&:hover": {
              opacity: 1,
              fontWeight: 500,
            },
          }}
        >
          清理全部
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <DeleteView
          isDarkMode={isDarkMode}
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
  isDarkMode: boolean;
  description?: string;
}) => {
  return (
    <Grid.Container
      css={{ borderRadius: "14px", padding: "0.75rem", width: "220px" }}
    >
      <Row justify="center" align="center">
        <Text b color={props.isDarkMode ? "#cccccc" : undefined}>
          {props.title}
        </Text>
      </Row>
      <Row justify="center" align="center">
        <div
          style={{
            padding: 16,
            color: props.isDarkMode ? "#cccccc" : undefined,
          }}
        >
          <Text>{props.description}</Text>
        </div>
      </Row>
      <Row justify="flex-end" align="center">
        <Button
          size="sm"
          light
          auto
          onPress={props.onCancel}
          css={{
            color: props.isDarkMode ? "#cccccc" : undefined,
          }}
        >
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
