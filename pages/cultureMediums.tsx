import { useState,useEffect } from "react";
import type { NextPage } from "next";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import {FaPlus} from "react-icons/fa";
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
import apiClient from "@/services/apiClient";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import { materialData } from "../data";
import useModal from "../src/hooks/useModal";

const CultureMedium: NextPage = () => {
  const { modalOpen, showModal, closeModal } = useModal();
  const [materialType, setMaterialType] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [plantType, setPlantType] = useState("");
  const [producedBy, setProducedBy] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isError, setIsError] = useState(false);
  const [cultureMedium, setCultureMedium] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/cultureMedium");
        setCultureMedium(response.data.result);
        console.log(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  // add new material
  const addMedium = () => {
    if (!materialName) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
    }
  };

  const itemsPerPage = 10;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(cultureMedium);
  const { paginatedData, totalPages, currentPage, handleChangePage } =
    usePagination(sortedData, itemsPerPage);

    const [showFullNotes, setShowFullNotes] = useState<Record<number, boolean>>({});
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

  const StyledTableCellMediumName = styled(TableCell)`
  color: white;
  font-weight: bold;
  text-align: center;
  width: 250px;
`;

const StyledTableCellMediumDescription = styled(TableCell)`
  color: white;
  font-weight: bold;
  text-align: center;
  width: 350px;
`;
const StyledTableCellID = styled(TableCell)`
color: white;
  text-align: center;
  width: 50px; // Tùy chỉnh chiều rộng của cột ở đây
`;
const StyledTableCellBodyID = styled(TableCell)`
  color: black;
  text-align: center;
  width: 50px;
`;

  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Culture Medium</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add Culture Medium"
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
          <StyledTableCellID>
      #
    </StyledTableCellID>
            <StyledTableCellMediumName>
              Culture Medium Name
            </StyledTableCellMediumName>
            <StyledTableCellMediumDescription>
              Culture Medium Description
            </StyledTableCellMediumDescription>
            <StyledTableCellMediumDescription>
              Actions
            </StyledTableCellMediumDescription>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {paginatedData &&
            paginatedData.map((
              {
                Culture_Medium_ID,
                Culture_Medium_Name,
                Culture_Medium_Description
              },
              index
            ) => (
              <TableRow key={Culture_Medium_ID}>
                <StyledTableCellBodyID>{index + 1}</StyledTableCellBodyID>
                <TableCell>{Culture_Medium_Name}</TableCell>
                <TableCell>{Culture_Medium_Description}</TableCell>
                <TableCell  align="center">
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
        title="Add Material to Inventory"
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={addMedium}
      >
        <>
          <small className="text-muted">
            Material is a consumable product using in your farm such as seeds,
            growing medium, fertilizer, pesticide, and so on.
          </small>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Choose type of material</Form.Label>
              <Form.Select onChange={(e) => setMaterialType(e.target.value)}>
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
                  <Form.Label>Plant Type</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setPlantType(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Label>Produced by</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setProducedBy(e.target.value)}
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
                    onChange={(e) => setMaterialType(e.target.value)}
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
          </Form>
        </>
      </ModalContainer>
    </Layout>
  );
};

export default CultureMedium;
