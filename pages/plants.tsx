import { useState, useEffect, useCallback, useRef } from "react";
import type { NextPage } from "next";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/lab/Pagination";
import useSortData from "../src/hooks/useSortData";
import usePagination from "../src/hooks/usePagination";

import withAuth from "@/middleware/withAuth";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/auth";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import useModal from "../src/hooks/useModal";

import ConfirmModal from "@/components/ConfirmModal";
const Plant: NextPage = () => {
  const resetFields = () => {
    setPlantName("");
    setScientificName("");
    setPlantDescription("");
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [plantName, setPlantName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [plantDescription, setPlantDescription] = useState("");

  interface IPlant {
    Plant_ID: number;
    Plant_Name: string;
    Scientific_Name: string;
    Plant_Description: string;
  }

  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;


  const [Data, setData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/plant", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setData(response.data.result);
      } else {
        console.error("Error fetching current plant: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching current plant: " + error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleShowConfirmModal = (item: any) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async (item: any) => {
    // call API to delete item
    
    const response = await apiClient.delete(
      `/plant/${item.Plant_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // refresh data
    fetchData();
    // close modal
    handleCloseConfirmModal();
    resetFields();
  };

  // EDIT USER
  const [editing, setEditing] = useState<IPlant | null>(null);

  const handleEdit = (Plant: IPlant) => {
    setEditing(Plant);

    // Set the default values for the input fields
    setPlantName(Plant.Plant_Name);
    setScientificName(Plant.Scientific_Name);
    setPlantDescription(Plant.Plant_Description);

    setIsAdding(false);
    showModal();
  };

  const handleSave = async () => {
    if (!editing) {
      console.error("No Plant selected for editing");
      return;
    }
    // Validate Plant input and call API to update Plant information
    try {
      const response = await apiClient.put(
        `/Plant/${editing?.Plant_ID}`,
        {
          Plant_Name: plantName,
    Scientific_Name: scientificName,
    Plant_Description: plantDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh user data
        fetchData();
        console.log(response);

        // Close modal and reset editing
        closeModal();
        resetFields();
        setEditing(null);
      } else {
        console.error("Error updating user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating user: " + error);
    }
  };

  // ADD 
  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = () => {
    setIsAdding(true);
    showModal();
  };
  const handleCreate = async () => {
    // Validate user input and call API to create a new user
    try {
      const response = await apiClient.post(
        "/users/createUser",
        {
          Plant_Name: plantName,
          Scientific_Name: scientificName,
          Plant_Description: plantDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh user data
        fetchData();
        console.log(response);

        // Close modal and reset editing
        closeModal();
        resetFields();
        setIsAdding(false);
      } else {
        console.error("Error creating user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating user: " + error);
    }
  };

  const itemsPerPage = 5;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(Data);
  const { paginatedData, totalPages, currentPage, handleChangePage } =
    usePagination(sortedData, itemsPerPage);

  // css for header
  const StyledTableHead = styled(TableHead)`
    background-color: #358a51;
  `;

  const StyledTableCell = styled(TableCell)`
    color: white;
    font-weight: bold;
    text-align: center;
  `;
  //css for setting width of id table
  const StyledTableCellWidth = styled(TableCell)`
    width: 5px;
    color: white;
    font-weight: bold;
    text-align: center;
  `;

  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Plant</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add plant"
            icon={<FaPlus className="me-2" />}
            onClick={handleAdd}
            variant="primary"
          />
        </Col>
      </Row>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCellWidth>#</StyledTableCellWidth>
              <StyledTableCell onClick={() => handleRequestSort("plantName")}>
                <TableSortLabel
                  active={sortConfig.key === "plantName"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("plantName")}
                >
                  Plant Name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("scientificName")}>
                <TableSortLabel
                  active={sortConfig.key === "scientificName"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("scientificName")}
                >
                  Scientific Name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                onClick={() => handleRequestSort("plantDescription")}
              >
                <TableSortLabel
                  active={sortConfig.key === "plantDescription"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("plantDescription")}
                >
                  Plant Description
                </TableSortLabel>
              </StyledTableCell>
              
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map((item, index) => (
                <TableRow key={item.Plant_ID}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{item.Plant_Name}</TableCell>
                  <TableCell>{item.Scientific_Name}</TableCell>
                  <TableCell>{item.Plant_Description}</TableCell>
                  
                  <TableCell>
                    <EditIcon
                      onClick={() => handleEdit(item as IPlant)}
                      className="show-pointer text-secondary icon-bordered icon-spacing"
                    />
                    <DeleteIcon
                      onClick={() => handleShowConfirmModal(item)}
                      className="show-pointer text-danger icon-bordered"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </div>

      <ModalContainer
        title={isAdding ? "Add Plant" : "Edit Plant"}
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={isAdding ? handleCreate : handleSave}
      >
        <>
          <Form>
            <Form.Group controlId="plantName">
              <Form.Label>Plant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Plant Name"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="scientificName">
              <Form.Label>Scientitfic Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Scientitfic Name"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="plantDescription">
              <Form.Label>Plant Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Plant Description"
                value={plantDescription}
                onChange={(e) => setScientificName(e.target.value)}
              />
            </Form.Group>

          </Form>
        </>
      </ModalContainer>

      {itemToDelete && (
        <ConfirmModal
          show={showConfirmModal}
          handleClose={handleCloseConfirmModal}
          handleConfirm={() => handleDeleteItem(itemToDelete)}
          item={itemToDelete}
        />
      )}
    </Layout>
  );
};

export default withAuth(Plant);
