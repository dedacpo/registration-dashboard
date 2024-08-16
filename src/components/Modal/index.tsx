import { useState, useEffect } from "react";
import * as ReactModal from 'react-modal';
import * as S from "./styles";

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

  useEffect(() => {
    ReactModal.setAppElement("body");
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Example Modal"
      style={S.customStyles}
    >
      <button
        onClick={onRequestClose}
        style={{
          ...S.closeButtonStyles,
          ...(isHover ? S.closeButtonHoverStyles : {}),
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

export default Modal;