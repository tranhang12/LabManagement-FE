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

import withAuth from "@/middleware/withAuth";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/auth";
import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import useModal from "../src/hooks/useModal";

const Micropropagation: NextPage = () => {
  const resetFields = () => {
    setPlant(0);
    setCultureMedium(0);
    setCulture(0);
    setBudRegeneration(0);
    setMultiplyBud(0);
    setRooting(0);
    setTemperatureMax(0);
    setTemperatureMin(0);
    setLightIntensity("");
    setLightingTime("");
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [plant, setPlant] = useState(0);
  const [cultureMedium, setCultureMedium] = useState(0);
  const [culture, setCulture] = useState(0);
  const [budRegeneration, setBudRegeneration] = useState(0);
  const [multiplyBud, setMultiplyBud] = useState(0);
  const [rooting, setRooting] = useState(0);
  const [temperatureMax, setTemperatureMax] = useState(0);
  const [temperatureMin, setTemperatureMin] = useState(0);
  const [lightIntensity, setLightIntensity] = useState("");
  const [lightingTime, setLightingTime] = useState("");
  const [isError, setIsError] = useState(false);

  interface IMicrop {
    Culture_ID: number;
    Plant_ID: number;
    Plant_Name: string;
    Culture_Medium_Name: string;
    Medium_ID: number;
    Duration_Of_Culture: number;
    Duration_Of_Bud_Regeneration: number;
    Duration_Of_Multiply_Bud: number;
    Duration_Of_Rooting: number;
    Temperature_Min: number;
    Temperature_Max: number;
    Light_Intensity: number;
    Lighting_Time: number;
  }

  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;
  const [data, setData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/culture", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status) {
        // console.log(response.data.data)
        setData(response.data.result);
      } else {
        console.error("Error fetching current plant: " + response.data);
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

    const response = await apiClient.delete(`/culture/${item.Culture_ID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // refresh data
    fetchData();
    // close modal
    handleCloseConfirmModal();
    resetFields();
  };

  // EDIT USER
  const [editing, setEditing] = useState<IMicrop | null>(null);

  const handleEdit = (microp: IMicrop) => {
    setEditing(microp);

    // Set the default values for the input fields
    setPlant(microp.Plant_ID);
    setCultureMedium(microp.Culture_Medium_Name);
    setCulture(microp.Duration_Of_Culture);
    setBudRegeneration(microp.Duration_Of_Bud_Regeneration);
    setMultiplyBud(microp.Duration_Of_Multiply_Bud);
    setRooting(microp.Duration_Of_Rooting);
    setTemperatureMax(microp.Temperature_Max);
    setTemperatureMin(microp.Temperature_Min);
    setLightIntensity(microp.Light_Intensity);
    setLightingTime(microp.Lighting_Time);

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
        `/culture/${editing?.Culture_ID}`,
        {
          Plant_ID: plant,
          Medium_ID: cultureMedium,
          Duration_Of_Culture: culture,
          Duration_Of_Bud_Regeneration: budRegeneration,
          Duration_Of_Multiply_Bud: multiplyBud,
          Duration_Of_Rooting: rooting,
          Temperature_Min: temperatureMin,
          Temperature_Max: temperatureMax,
          Light_Intensity: lightIntensity,
          Lighting_Time: lightingTime,
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
          Plant_ID: plant,
          Medium_ID: cultureMedium,
          Duration_Of_Culture: culture,
          Duration_Of_Bud_Regeneration: budRegeneration,
          Duration_Of_Multiply_Bud: multiplyBud,
          Duration_Of_Rooting: rooting,
          Temperature_Min: temperatureMin,
          Temperature_Max: temperatureMax,
          Light_Intensity: lightIntensity,
          Lighting_Time: lightingTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh culture data
        fetchData();
        console.log(response);

        // Close modal and reset editing
        closeModal();
        resetFields();
        setIsAdding(false);
      } else {
        console.error("Error creating culture: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating culture: " + error);
    }
  };

  const itemsPerPage = 10;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(data);
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
    max-width: 300px;
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
          <h3 className="pb-3">Micropropagation</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add Micropropagation"
            icon={<FaPlus className="me-2" />}
            onClick={showModal}
            variant="primary"
          />
        </Col>
      </Row>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>

              <StyledTableCell>Plant</StyledTableCell>
              <StyledTableCell>Culture Medium</StyledTableCell>
              <StyledTableCell>Culture</StyledTableCell>
              <StyledTableCell>Bud Regeneration</StyledTableCell>
              <StyledTableCell>Multiply Bud</StyledTableCell>
              <StyledTableCell>Rooting</StyledTableCell>
              <StyledTableCell>Temperature</StyledTableCell>
              <StyledTableCell>Light Intensity</StyledTableCell>
              <StyledTableCell>Lighting Time</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map((item, index) => (
                <TableRow key={item.Culture_ID}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{item.Plant_Name}</TableCell>
                  <TableCell>{item.Culture_Medium_Name}</TableCell>
                  <TableCell>{item.Duration_Of_Culture} days</TableCell>
                  <TableCell>
                    {item.Duration_Of_Bud_Regeneration} days
                  </TableCell>
                  <TableCell>{item.Duration_Of_Multiply_Bud} days</TableCell>
                  <TableCell>{item.Duration_Of_Rooting} days</TableCell>
                  <TableCell>
                    {item.Temperature_Min}-{item.Temperature_Max}°C
                  </TableCell>
                  <TableCell>{item.Light_Intensity} lux</TableCell>
                  <TableCell>{item.Lighting_Time} hours</TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={showModal}
                      className="show-pointer text-secondary icon-bordered icon-spacing"
                    />
                    <DeleteIcon
                      onClick={showModal}
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

                </Form>
        </>

      </ModalContainer>
    </Layout>
  );
};

export default Micropropagation;
