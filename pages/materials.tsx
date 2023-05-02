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

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import useModal from "../src/hooks/useModal";

const Material: NextPage = () => {
  const { modalOpen, showModal, closeModal } = useModal();
  const [materialCategory, setMaterialCategory] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Produced_By, setProduced_By] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isError, setIsError] = useState(false);

  //fetch data
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/material");
        setMaterials(response.data.result);
        console.log(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  // add new material
  const addMaterial = () => {
    if (!materialName) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
    }
  };

  const itemsPerPage = 10;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(materials);
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
            onClick={showModal}
            variant="primary"
          />
        </Col>
      </Row>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCellWidth>
                <TableSortLabel
                  active={sortConfig.key === "index"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("index")}
                >
                  ID
                </TableSortLabel>
              </StyledTableCellWidth>
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
                onClick={() => handleRequestSort("expiration_date")}
              >
                <TableSortLabel
                  active={sortConfig.key === "expiration_date"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("expiration_date")}
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
              paginatedData.map(
                (
                  {
                    id,
                    Category,
                    Name,
                    Price,
                    Produced_By,
                    Quantity,
                    Unit,
                    expiration_date,
                    Additional_Notes,
                  },
                  index
                ) => (
                  
                  <TableRow key={id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{Category}</TableCell>
                    <TableCell>{Name}</TableCell>
                    <TableCell>${Price}</TableCell>
                    <TableCell>{Produced_By}</TableCell>
                    <TableCell>{Quantity}</TableCell>
                    <TableCell>{Unit}</TableCell>
                    <TableCell>{new Date(expiration_date).toLocaleDateString()}</TableCell>
                    <NotesTableCell
                      showFull={showFullNotes[id]}
                      onClick={() => handleNotesClick(id)}
                    >
                      {Additional_Notes}
                    </NotesTableCell>
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
                )
              )}
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
        handleSubmitModal={addMaterial}
      >
        <>
          <small className="text-muted">
          Materials can include buffering agents, supplements, antibiotics and antifungals, gelatin and agar, cell culture vessels, and equipment such as a laminar flow hood, CO2 incubator, centrifuge, and cell counter.
          </small>
          <Form className="mt-3">
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
                {/* <Col>
                  <Form.Label>Plant Type</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setPlantType(e.target.value)}
                  />
                </Col> */}
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
          </Form>
        </>
      </ModalContainer>
    </Layout>
  );
};

export default Material;
