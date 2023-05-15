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

import { useState, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Card, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import {toast} from 'react-toastify'

import withAuth from "@/middleware/withAuth";
import { batch, useSelector } from "react-redux";
import { selectAuthState } from "@/store/auth";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import { cropsData } from "../data";
import useModal from "../src/hooks/useModal";
import apiClient from "@/services/apiClient";
import ConfirmModal from "@/components/ConfirmModal";

const Crops: NextPage = () => {
  const resetFields = () => {
    setPlantType("");
    setTransitionTime("");
    setBatchID("");
    setArea("");
    // setContainerQuantity("");
    setCurrentQuantity("");
    setInitialQuantity("");
    setRemainingDays("");
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [plantType, setPlantType] = useState("");
  const [transitionTime, setTransitionTime] = useState("");
  const [batchID, setBatchID] = useState("");
  const [area, setArea] = useState("");
  // const [containerQuantity, setContainerQuantity] = useState(0);
  const [containerType, setContainerType] = useState("");
  // const [createdDate, setCreatedDate] = useState("");
  const [status, setStatus] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [remainingDays, setRemainingDays] = useState("");
  const [taskID, setTaskID] = useState(0);
  // get current date
  const currentDate = new Date();
  // format to YYYY-MM-DD
  const formattedDate = currentDate.toISOString().substring(0, 10);
  const [createdDate, setCreatedDate] = useState(formattedDate);
  const [isError, setIsError] = useState(false);

  const validateInput = () => {
    if (
      !plantType ||
      !batchID ||
      !area ||
      !initialQuantity ||
      !remainingDays
    ) {
      setIsError(true);
      return false;
    }
    setIsError(false);
    return true;
  };
  interface ICrop {
    Culture_Plan_ID: number;
    Plant_Type: string;
    Area: string;
    // Container_Quantity: number;
    Container_Type: string;
    Transition_Time: string;
    BatchID: string;
    Created_Date: string;
    Task_ID: string;
    Status: string;
    Initial_Quantity: string;
    Current_Quantity: string;
    Remaining_Days: string;
  }


  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  // culture plan (crop) list
  const [Data, setData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/culturePlan", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setData(response.data.result);
      } else {
        console.error("Error fetching Crop: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Crop: " + error);
    }
  }, [accessToken]);

  //get harvest crops (Archive tab)
  const [harvestData, setHarvestData] = useState([]);
  const fetchHarvestData = useCallback(async () => {
    try {
      const response = await apiClient.get("/harvestStorage", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        console.log(response)
        setHarvestData(response.data.result);
      } else {
        console.error("Error fetching Crop: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Crop: " + error);
    }
  }, [accessToken]);

  type Area = {
    Area_Name: string;
  };
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  //get all areas
  useEffect(() => {
    apiClient.get("/all-areas")
    .then((res) => res.data)
    .then((data) => setAllAreas(data));
  }, []);

  // fetch data
  useEffect(() => {
    fetchData();
    fetchHarvestData();
  }, [fetchData, fetchHarvestData]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ICrop | null>(null);

  const handleShowConfirmModal = (item: ICrop) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async (item: ICrop) => {
    try {
      const response = await apiClient.delete(
        `/culturePlan/${item.Culture_Plan_ID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // refresh data
      fetchData();
      toast.success('Delete successfully!')
    }catch (error: any) {
      if (error instanceof Error) {
        console.error('Error deleting item:', error);
        toast.error(error.message);
      }
    } finally {
      // close modal and reset fields whether request was successful or not
      handleCloseConfirmModal();
      resetFields();
    }
  };

  // EDIT
  const [editing, setEditing] = useState<ICrop | null>(null);

  const handleEdit = (Crop: ICrop) => {
    setIsAdding(false);
    setEditing(Crop);

    // Set the default values for the input fields
    setPlantType(Crop.Plant_Type);
    setTransitionTime(Crop.Transition_Time);
    setBatchID(Crop.BatchID);
    setArea(Crop.Area);
    // setContainerQuantity(Crop.Container_Quantity);
    setCreatedDate(Crop.Created_Date);
    setCurrentQuantity(Crop.Current_Quantity);
    setInitialQuantity(Crop.Initial_Quantity);
    setRemainingDays(Crop.Remaining_Days);
    showModal();
  };

  const handleSave = async () => {
    if (!editing) {
      console.error("No Crop selected for editing");
      return;
    }
    // Validate Crop input and call API to update Crop information
    if (!validateInput()) {
      console.error("Invalid Crop input");
      return;
    }

    try {
      const response = await apiClient.put(
        `/culturePlan/${editing?.Culture_Plan_ID}`,
        {
          Plant_Type: plantType,
          Area: area,
          // Container_Quantity: containerQuantity,
          Container_Type: containerType,
          Transition_Time: transitionTime,
          BatchID: batchID,
          Created_Date: createdDate,
          Task_ID: taskID,
          Status: status,
          Initial_Quantity: initialQuantity,
          Current_Quantity: currentQuantity,
          Remaining_Days: remainingDays,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh Crop data
        fetchData();
        console.log(response);

        // Close modal and reset editingCrop
        closeModal();
        resetFields();
        setEditing(null);
      } else {
        console.error("Error updating culture plan: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating culture plan: " + error);
    }
  };

  // ADD Crop
  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = () => {
    setIsAdding(true);
    showModal();
  };
  const handleCreate = async () => {
    try {
      const response = await apiClient.post(
        "/culturePlan",
        {
          Plant_Type: plantType,
          Area: area,
          Container_Type: containerType,
          Created_Date: createdDate,
          Transition_Time: transitionTime,
          Status: status,
          Initial_Quantity: initialQuantity,
          Current_Quantity: initialQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh Crop data
        fetchData();
        // console.log(response);

        // Close modal and reset editingCrop
        closeModal();
        resetFields();
        setIsAdding(false);
      } else {
        console.error("Error creating Crop: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating Crop: " + error);
    }
  };

  const itemsPerPage = 10;
// sort and paging for Crop table
  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(Data);
  const { paginatedData, totalPages, currentPage, handleChangePage } =
    usePagination(sortedData, itemsPerPage);
// sort and paging for Archive table
const { sortedData: sortedData2, requestSort: requestSort2, sortConfig: sortConfig2 } = useSortData(harvestData);
const { paginatedData: paginatedData2, totalPages: totalPages2, currentPage: currentPage2, handleChangePage: handleChangePage2 } = usePagination(sortedData2, itemsPerPage);
  //css for header
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
          <h3 className="pb-3">Crops</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs defaultActiveKey="batch">
            <Tab eventKey="batch" title="Batch" className="pt-3">
              <ButtonIcon
                label="Add New Batch"
                icon={<FaPlus className="me-2" />}
                onClick={handleAdd}
                variant="primary"
              />

              <TableContainer component={Paper} className="my-4">
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableCellWidth>#</StyledTableCellWidth>
                      <StyledTableCell>
                        <TableSortLabel
                          active={sortConfig.key === "Plant_Type"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Plant_Type")}
                        >
                          Crop Variety Name
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("BatchID")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "batchID"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("BatchID")}
                        >
                          Batch ID
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("Created_Date")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "Created_Date"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Created_Date")}
                        >
                          Start Date
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("Transition_Time")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "Transition_Time"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Transition_Time")}
                        >
                          Planned Time
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("Remaining_Days")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "Remaining_Days"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Remaining_Days")}
                        >
                          Remaining days
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("Initial_Quantity")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "Initial_Quantity"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Initial_Quantity")}
                        >
                          Initial Quantity
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("Current_Quantity")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "Current_Quantity"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Current_Quantity")}
                        >
                          Current Quantity
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {paginatedData &&
                      paginatedData.map((item, index) => (
                        <TableRow key={item.Culture_Plan_ID}>
                          <TableCell>
                            
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <Link href={`/crops/${item.Culture_Plan_ID}`}>
                              {item.Plant_Type}
                            </Link>
                          </TableCell>
                          <TableCell>{item.BatchID}</TableCell>
                          <TableCell>
                            {new Date(item.Created_Date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              item.Transition_Time
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{item.Remaining_Days} Days</TableCell>
                          <TableCell>
                            {item.Initial_Quantity} {item.Container_Type}
                          </TableCell>
                          <TableCell>
                            {item.Current_Quantity} {item.Container_Type}
                          </TableCell>
                          <TableCell>
                            <EditIcon
                              onClick={() => handleEdit(item as ICrop)}
                              className="show-pointer text-secondary icon-bordered icon-spacing"
                            />
                            <DeleteIcon
                              onClick={() =>
                                handleShowConfirmModal(item as ICrop)
                              }
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
            </Tab>
            {/* Archives */}
            <Tab eventKey="archives" title="Archives">
            <TableContainer component={Paper} className="my-4">
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableCellWidth>#</StyledTableCellWidth>
                      <StyledTableCell
                        onClick={() => handleRequestSort("BatchID")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "batchID"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("BatchID")}
                        >
                          Batch ID
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={sortConfig.key === "Plant_Type"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Plant_Type")}
                        >
                          Crop Variety Name
                        </TableSortLabel>
                      </StyledTableCell>
                      
                      <StyledTableCell
                        onClick={() => handleRequestSort("Created_Date")}
                      >
                        <TableSortLabel
                          active={sortConfig.key === "Created_Date"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Created_Date")}
                        >
                          Harvest Date
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleRequestSort("Quantity")}
                      >
                        
                        <TableSortLabel
                          active={sortConfig.key === "Quantity"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Quantity")}
                        >
                          Quantity
                        </TableSortLabel>
                      </StyledTableCell>
                      
                      <StyledTableCell
                        onClick={() => handleRequestSort("Source_Area_Name")}
                      >
                        
                        <TableSortLabel
                          active={sortConfig.key === "Source_Area_Name"}
                          direction={sortConfig.direction}
                          onClick={() => handleRequestSort("Source_Area_Name")}
                        >
                          Source Area Name
                        </TableSortLabel>
                      </StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {paginatedData2 &&
                      paginatedData2.map((item, index) => (
                        <TableRow key={item.ID}>
                          <TableCell>
                            
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>{item.BatchID}</TableCell>
                          <TableCell>
                            <Link href={`/crops/${item.Culture_Plan_ID}`}>
                              {item.Plant_Type}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {new Date(item.Created_Date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {item.Quantity} {item.Container_Type}
                          </TableCell>
                          <TableCell>
                            {item.Source_Area_Name}
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
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ModalContainer
        title={isAdding ? "Add new batch" : "Edit batch"}
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={isAdding ? handleCreate : handleSave}
      >
        <>
          {/* <small className="text-muted">
            Crop Batch is a quantity or consignment of crops done at one time.
          </small> */}
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Crop Variety</Form.Label>
              <Form.Control
                type="text"
                value={plantType}
                onChange={(e) => setPlantType(e.target.value)}
              />
              {isError && (
                <Form.Text className="text-danger">
                  The name of crop variety field is required
                </Form.Text>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Select initial area</Form.Label>
              <Form.Select onChange={(e) => setArea(e.target.value)}>
                <option value={area}>Select area to grow</option>
                {allAreas.map((area) => (
                <option key={area.Area_Name} value={area.Area_Name}>
                  {area.Area_Name}
                </option>
              ))}
              </Form.Select>
              {isError && (
                <Form.Text className="text-danger">
                  The initial area field is required
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Initial Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={initialQuantity}
                    onChange={(e) => setInitialQuantity(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The initial quantity field is required
                    </Form.Text>
                  )}
                </Col>
                {/* <Col>
                <Form.Label>Current Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The current quantity field is required
                    </Form.Text>
                  )}
                </Col> */}
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Container Type</Form.Label>
                  <Form.Select onChange={(e) => setContainerType(e.target.value)}>
                    <option value={containerType}>Select Unit</option>
                    <option value="Pots">Pots</option>
                    <option value="Trays">Trays</option>
                    <option value="Bags">Bags</option>
                    <option value="Petri dishes">Petri dishes</option>
                    <option value="Flasks">Flasks</option>
                  </Form.Select>
                  {isError && (
                    <Form.Text className="text-danger">
                      The container type field is required
                    </Form.Text>
                  )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={formattedDate}
                    onChange={(e) => setCreatedDate(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The created date field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                <Form.Label>Estimated planting time</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={(e) => setTransitionTime(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The planned time field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
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

export default Crops;
