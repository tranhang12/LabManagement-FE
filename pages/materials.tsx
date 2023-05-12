import { useState, useEffect, useCallback } from "react";
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

import withRole from "@/middleware/withRole";

import withAuth from "@/middleware/withAuth";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/auth";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import useModal from "../src/hooks/useModal";

import ConfirmModal from "@/components/ConfirmModal";

const Material: NextPage = () => {
  const resetFields = () => {
    setCategory("");
    setName("");
    setQuantity("");
    setProduced_By("");
    setUnit("");
    setExpiration_Date("");
    setAdditional_Notes("");
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [Category, setCategory] = useState("");
  const [Name, setName] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Produced_By, setProduced_By] = useState("");
  const [Price, setPrice] = useState("");
  const [Unit, setUnit] = useState("");
  const [Expiration_Date, setExpiration_Date] = useState("");
  const [Additional_Notes, setAdditional_Notes] = useState("");
  const [isError, setIsError] = useState(false);

  const validateInput = () => {
    if (!Name || !Produced_By || !Quantity || !Unit || !Expiration_Date) {
      setIsError(true);
      return false;
    }
    setIsError(false);
    return true;
  };

  interface IMaterial {
    Material_ID: number;
    Category: string;
    Name: string;
    Price: string;
    Produced_By: string;
    Quantity: string;
    Additional_Notes: string;
    Unit: string;
    Expiration_Date: string;
  }

  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  const [MaterialData, setMaterialData] = useState([]);
  const fetchMaterialData = useCallback(async () => {
    try {
      const response = await apiClient.get("/material/getAllMaterial", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setMaterialData(response.data.result);
      } else {
        console.error("Error fetching Material: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Material: " + error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchMaterialData();
  }, [fetchMaterialData]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IMaterial | null>(null);

  const handleShowConfirmModal = (item: IMaterial) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async (item: IMaterial) => {
    // call API to delete item
    // await apiClient.delete(`/Materials/deleteMaterial/${id}`);
    const response = await apiClient.delete(
      `/material/deleteMaterial/${item.Material_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // refresh data
    fetchMaterialData();
    // close modal
    handleCloseConfirmModal();
    resetFields();
  };

  // EDIT Material
  const [editingMaterial, setEditingMaterial] = useState<IMaterial | null>(
    null
  );

  const handleEditMaterial = (Material: IMaterial) => {
    setIsAddingMaterial(false);
    setEditingMaterial(Material);

    // Set the default values for the input fields
    setCategory(Material.Category);
    setName(Material.Name);
    setQuantity(Material.Quantity);
    setProduced_By(Material.Produced_By);
    setPrice(Material.Price);
    setUnit(Material.Unit);

    setExpiration_Date(Material.Expiration_Date);
    setAdditional_Notes(Material.Additional_Notes);
    showModal();
  };

  const handleSaveMaterial = async () => {
    if (!editingMaterial) {
      console.error("No Material selected for editing");
      return;
    }
    // Validate Material input and call API to update Material information
    if (!validateInput()) {
      console.error("Invalid Material input");
      return;
    }

    try {
      const response = await apiClient.put(
        `/material/updateMaterial/${editingMaterial?.Material_ID}`,
        {
          Category: Category,
          Name: Name,
          Price: Price,
          Produced_By: Produced_By,
          Quantity: Quantity,
          Additional_Notes: Additional_Notes,
          Unit: Unit,
          Expiration_Date: Expiration_Date,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh Material data
        fetchMaterialData();
        console.log(response);

        // Close modal and reset editingMaterial
        closeModal();
        resetFields();
        setEditingMaterial(null);
      } else {
        console.error("Error updating Material: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating Material: " + error);
    }
  };

  // ADD Material
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const handleAddMaterial = () => {
    setIsAddingMaterial(true);
    showModal();
  };
  const handleCreateMaterial = async () => {
    try {
      const response = await apiClient.post(
        "/material/addMaterial",
        {
          Category: Category,
          Name: Name,
          Price: Price,
          Produced_By: Produced_By,
          Quantity: Quantity,
          Additional_Notes: Additional_Notes,
          Unit: Unit,
          Expiration_Date: Expiration_Date,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh Material data
        fetchMaterialData();
        // console.log(response);

        // Close modal and reset editingMaterial
        closeModal();
        resetFields();
        setIsAddingMaterial(false);
      } else {
        console.error("Error creating Material: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating Material: " + error);
    }
  };

  const itemsPerPage = 10;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(MaterialData);
  const { paginatedData, totalPages, currentPage, handleChangePage } =
    usePagination(sortedData, itemsPerPage);

  const [showFullNotes, setShowFullNotes] = useState<Record<number, boolean>>(
    {}
  );
  const handleNotesClick = (id: number) => {
    setShowFullNotes((prevShowFullNotes) => ({
      ...prevShowFullNotes,
      [id]: !prevShowFullNotes[id],
    }));
  };

  // css for header
  const StyledTableHead = styled(TableHead)`
    background-color: #358a51;
  `;

  const StyledTableCell = styled(TableCell)`
    color: white;
    font-weight: bold;
    text-align: center;
  `;
  // css for note table
  const NotesTableCell = styled(TableCell)<{ showFull?: boolean }>`
    max-width: 100px;
    white-space: ${({ showFull }) => (showFull ? "normal" : "nowrap")};
    overflow: hidden;
    text-overflow: ellipsis;
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
          <h3 className="pb-3">Materials</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add Material"
            icon={<FaPlus className="me-2" />}
            onClick={handleAddMaterial}
            variant="primary"
          />
        </Col>
      </Row>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCellWidth>#</StyledTableCellWidth>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === "Category"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Category")}
                >
                  Category
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Name")}>
                <TableSortLabel
                  active={sortConfig.key === "Name"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Name")}
                >
                  Name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Price")}>
                <TableSortLabel
                  active={sortConfig.key === "Price"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Price")}
                >
                  Price
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Produced_By")}>
                <TableSortLabel
                  active={sortConfig.key === "Produced_By"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Produced_By")}
                >
                  Produced By
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Quantity")}>
                <TableSortLabel
                  active={sortConfig.key === "Quantity"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Quantity")}
                >
                  Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Unit")}>
                <TableSortLabel
                  active={sortConfig.key === "Unit"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Unit")}
                >
                  Unit
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                onClick={() => handleRequestSort("Expiration_Date")}
              >
                <TableSortLabel
                  active={sortConfig.key === "Expiration_Date"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Expiration_Date")}
                >
                  Expiration date
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                onClick={() => handleRequestSort("Additional_Notes")}
              >
                <TableSortLabel
                  active={sortConfig.key === "Additional_Notes"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Additional_Notes")}
                >
                  Additional Notes
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map((item, index) => (
                <TableRow key={item.Material_ID}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{item.Category}</TableCell>
                  <TableCell>{item.Name}</TableCell>
                  <TableCell>${item.Price}</TableCell>
                  <TableCell>{item.Produced_By}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>
                  <TableCell>{item.Unit}</TableCell>
                  <TableCell>
                    {new Date(item.Expiration_Date).toLocaleDateString()}
                  </TableCell>
                  <NotesTableCell
                    showFull={showFullNotes[item.Material_ID]}
                    onClick={() => handleNotesClick(item.Material_ID)}
                  >
                    {item.Additional_Notes}
                  </NotesTableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => handleEditMaterial(item as IMaterial)}
                      className="show-pointer text-secondary icon-bordered icon-spacing"
                    />
                    <DeleteIcon
                      onClick={() => handleShowConfirmModal(item as IMaterial)}
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
        title={isAddingMaterial ? "Add Material to Inventory" : "Edit Material"}
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={
          isAddingMaterial ? handleCreateMaterial : handleSaveMaterial
        }
      >
        <>
          <small className="text-muted">
            Materials can include buffering agents, supplements, antibiotics and
            antifungals, gelatin and agar, cell culture vessels, and equipment
            such as a laminar flow hood, CO2 incubator, centrifuge, and cell
            counter.
          </small>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Choose type of material</Form.Label>
              <Form.Select
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Growing Medium">Growing Medium</option>
                <option value="Agrochemical">Agrochemical</option>
                <option value="Label and Crops Support">
                  Label and Crops Support
                </option>
                <option value="Seeding Container">Seeding Container</option>
                <option value="Post Harvest Supply">Post Harvest Supply</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Variety Name</Form.Label>
              <Form.Control
                type="text"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
              {isError && (
                <Form.Text className="text-danger">
                  The name field is required
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Produced by</Form.Label>
                  <Form.Control
                    type="text"
                    value={Produced_By}
                    onChange={(e) => setProduced_By(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The produced by field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={Quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The Quantity field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    value={Unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="Packets">Packets</option>
                    <option value="g">g</option>
                    <option value="Kg">Kg</option>
                    <option value="mL">mL</option>
                    <option value="µg">µg</option>
                    <option value="Item">Item</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Price per Unit</Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={Price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </InputGroup>

                  {isError && (
                    <Form.Text className="text-danger">
                      The price field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Expiration date</Form.Label>
                  <Form.Control
                    type="date"
                    value={Expiration_Date}
                    onChange={(e) => setExpiration_Date(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The expiration date field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                onChange={(e) => setAdditional_Notes(e.target.value)}
                value={Additional_Notes}
                style={{ height: "120px" }}
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

export default withAuth(Material);
