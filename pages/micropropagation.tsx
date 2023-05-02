import { useState, useEffect } from "react";
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
import { cultureData } from "../data";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import useModal from "../src/hooks/useModal";

const Micropropagation: NextPage = () => {
  const { modalOpen, showModal, closeModal } = useModal();
  const [plant, setPlant] = useState("");
  const [cultureMedium, setCultureMedium] = useState("");
  const [culture, setCulture] = useState("");
  const [budRegeneration, setBudRegeneration] = useState("");
  const [multiplyBud, setMultiplyBud] = useState("");
  const [rooting, setRooting] = useState("");
  const [temperature, setTemperature] = useState("");
  const [lightIntensity, setLightIntensity] = useState("");
  const [lightingTime, setLightingTime] = useState("");
  const [isError, setIsError] = useState(false);

  //fetch data
  const [micropropagations, setMicropropagations] = useState([]);
  const [plants, setPlants] = useState([]);
  const [cultureMediums, setCultureMediums] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const responseMaterials = await apiClient.get("/material");
      const responsePlants = await apiClient.get("/plant");
      const responseCultures = await apiClient.get("/culture");
      
      setMicropropagations(responseMaterials.data.result);
      setPlants(responsePlants.data.result);
      setCultureMediums(responseCultures.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  // add new material
  const addMaterial = () => {
    if (!culture) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
    }
  };

  const itemsPerPage = 10;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(cultureData);
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
    paginatedData.map((
      {Culture_ID, Plant_ID, Medium, Duration_Of_Culture, Duration_Of_Bud_Regeneration, Duration_Of_Multiply_Bud, Duration_Of_Rooting, Temperature_Min, Temperature_Max, Light_Intensity, Lighting_Time}
      , index) => (
      <TableRow key={Culture_ID}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{Plant_ID}</TableCell>
        <TableCell>{Medium}</TableCell>
        <TableCell>{Duration_Of_Culture} days</TableCell>
        <TableCell>{Duration_Of_Bud_Regeneration} days</TableCell>
        <TableCell>{Duration_Of_Multiply_Bud} days</TableCell>
        <TableCell>{Duration_Of_Rooting} days</TableCell>
        <TableCell>{Temperature_Min}-{Temperature_Max}°C</TableCell>
        <TableCell>{Light_Intensity} lux</TableCell>
        <TableCell>{Lighting_Time} hours</TableCell>
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
        title="Add Micropropagation"
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={addMaterial}
      >
        <>
          <small className="text-muted">
          Materials can include buffering agents, supplements, antibiotics and antifungals, gelatin and agar, cell culture vessels, and equipment such as a laminar flow hood, CO2 incubator, centrifuge, and cell counter.
          </small>
          {/* <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Choose type of material</Form.Label>
              <Form.Select
                onChange={(e) => setMaterialCategory(e.target.value)}
              >
                <option value="1">Seed</option>
                <option value="2">Growing Medium</option>
                <option value="3">Agrochemical</option>
                <option value="4">Label and Crops Support</option>
                <option value="5">Seeding Container</option>
                <option value="6">Post Harvest Supply</option>
                <option value="7">Plant</option>
                <option value="8">Other Material</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Variety Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMaterialName(e.target.value)}
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
              <Form.Label>Variety Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMaterialName(e.target.value)}
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
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The quantity field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    onChange={(e) => setMaterialCategory(e.target.value)}
                  >
                    <option value="1">Seeds</option>
                    <option value="2">Packets</option>
                    <option value="3">Gram</option>
                    <option value="4">Kilogram</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Price per Unit</Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>€</InputGroup.Text>
                    <Form.Control
                      type="text"
                      onChange={(e) => setPriceUnit(e.target.value)}
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
                    onChange={(e) => setExpirationDate(e.target.value)}
                    value={expirationDate}
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
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                style={{ height: "120px" }}
              />
            </Form.Group>
          </Form> */}
        </>
      </ModalContainer>
    </Layout>
  );
};

export default Micropropagation;
