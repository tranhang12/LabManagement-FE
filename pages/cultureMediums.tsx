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
const CultureMedium: NextPage = () => {
  const resetFields = () => {
    setCultureMediumName("");
    setCultureMediumDescription("");
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [cultureMediumName, setCultureMediumName] = useState("");
  const [cultureMediumDescription, setCultureMediumDescription] = useState("");

  interface ICultureMedium {
    Culture_Medium_ID: number;
    Culture_Medium_Name: string;
    Culture_Medium_Description: string;
  }

  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  const [Data, setData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/cultureMedium", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setData(response.data.result);
      } else {
        console.error(
          "Error fetching current culture medium: " + response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching current culture medium: " + error);
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
      `/cultureMedium/${item.Culture_Medium_ID}`,
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
  const [editing, setEditing] = useState<ICultureMedium | null>(null);

  const handleEdit = (cultureMedium: ICultureMedium) => {
    setEditing(cultureMedium);

    // Set the default values for the input fields
    setCultureMediumName(cultureMedium.Culture_Medium_Name);
    setCultureMediumDescription(cultureMedium.Culture_Medium_Description);

    setIsAdding(false);
    showModal();
  };

  const handleSave = async () => {
    if (!editing) {
      console.error("No Culture medium selected for editing");
      return;
    }
    // Validate Culture medium input and call API to update Culture medium information
    try {
      const response = await apiClient.put(
        `/Plant/${editing?.Culture_Medium_ID}`,
        {
          Culture_Medium_Name: cultureMediumName,
          Culture_Medium_Description: cultureMediumDescription,
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
        "/cultureMedium",
        {
          Culture_Medium_Name: cultureMediumName,
          Culture_Medium_Description: cultureMediumDescription,
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
              <StyledTableCell
                onClick={() => handleRequestSort("cultureMediumName")}
              >
                <TableSortLabel
                  active={sortConfig.key === "cultureMediumName"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("cultureMediumName")}
                >
                  Culture Medium Name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                onClick={() => handleRequestSort("cultureMediumDescription")}
              >
                <TableSortLabel
                  active={sortConfig.key === "cultureMediumDescription"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("cultureMediumDescription")}
                >
                  Culture Medium Description
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
                  <TableCell>{item.Culture_Medium_Name}</TableCell>
                  <TableCell>{item.Culture_Medium_Description}</TableCell>

                  <TableCell>
                    <EditIcon
                      onClick={() => handleEdit(item as ICultureMedium)}
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
            <Form.Group controlId="cultureMediumName">
              <Form.Label>Plant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter culture Medium Name"
                value={cultureMediumName}
                onChange={(e) => setCultureMediumName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="cultureMediumDescription">
              <Form.Label>Culture Medium Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Culture Medium Description"
                value={cultureMediumDescription}
                onChange={(e) => setCultureMediumDescription(e.target.value)}
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

export default withAuth(CultureMedium);
