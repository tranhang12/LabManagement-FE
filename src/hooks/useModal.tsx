import { useState } from "react";

const useModal = (resetFields: () => void) => {
  const [modalOpen, setModalOpen] = useState(false);
  const showModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    if (typeof resetFields === "function") {
      resetFields();
    }
  };
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return { modalOpen, setModalOpen, showModal, closeModal, toggleModal };
};

export default useModal;
