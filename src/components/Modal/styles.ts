import styled from "styled-components";

export const customStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  content: {
    position: "relative" as const,
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    outline: "none",
  },
};

export const closeButtonStyles = {
  position: "absolute" as const,
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#333", // Cor do ícone de fechar
  transition: "color 0.2s", // Transição suave da cor
};

export const closeButtonHoverStyles = {
  color: "#e74c3c", // Cor de hover para o botão de fechar
};

export const Container = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
  gap: 10px;
`;

export const Button = styled.button<{ bgcolor: string }>`
  background-color: ${(props) => props.bgcolor};
  border: none;
  padding: 4px 16px;
  border-radius: 4px;
  &:hover {
    filter: brightness(0.9);
    cursor: pointer;
  }
`;
