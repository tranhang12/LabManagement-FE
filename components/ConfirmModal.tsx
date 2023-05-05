import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type ConfirmModalProps = {
    show: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
    item: {
        User_Name?: string
        Name?: string
        Plant_Name?: string
        Culture_Medium_Name?: string
    };
  };

const ConfirmModal = ({ show, handleClose, handleConfirm, item}: ConfirmModalProps) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {item.User_Name || item.Name || item.Plant_Name || item.Culture_Medium_Name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
