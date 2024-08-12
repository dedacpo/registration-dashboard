import { useState } from "react";
import ReactModal from "react-modal";
import {
  closeButtonHoverStyles,
  closeButtonStyles,
  customStyles,
} from "./styles";
import * as S from "./styles";

ReactModal.setAppElement("body");

export type ModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  title: React.ReactNode;
  actions: {
    label: string;
    onClick: () => void;
    bgcolor: string;
  }[];
};

export function Modal({
  isOpen,
  onRequestClose,
  children,
  title,
  actions,
}: ModalProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Example Modal"
      style={customStyles} // Aplica os estilos do modal
    >
      <button
        onClick={() => {}}
        style={{
          ...closeButtonStyles,
          ...(isHover ? closeButtonHoverStyles : {}),
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        &times;
      </button>
      <h2>{title}</h2>
      {children}

      <S.Container>
        {actions.map((action) => {
          return (
            <S.Button
              key={action.label}
              onClick={action.onClick}
              bgcolor={action.bgcolor}
            >
              {action.label}
            </S.Button>
          );
        })}
      </S.Container>
    </ReactModal>
  );
}
