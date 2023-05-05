
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


import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Card, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import { cropsData } from "../data";
import useModal from "../src/hooks/useModal";

const Crops: NextPage = () => {
  const { modalOpen, showModal, closeModal } = useModal();
  const [area, setArea] = useState("");
  const [plantType, setPlantType] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [isError, setIsError] = useState(false);

  const addCrops = () => {
    if (!area || !plantType || !variety || !quantity || !type) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
    }
  };

  
  const itemsPerPage = 10;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(cropsData);
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
                onClick={showModal}
                variant="primary"
              />
            
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
                  #
                </TableSortLabel>
              </StyledTableCellWidth>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === "Category"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Category")}
                >
                  Crop Variety
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Name")}>
                <TableSortLabel
                  active={sortConfig.key === "Name"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Name")}
                >
                  Batch ID
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Price")}>
                <TableSortLabel
                  active={sortConfig.key === "Price"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Price")}
                >
                  Start Date
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Produced_By")}>
                <TableSortLabel
                  active={sortConfig.key === "Produced_By"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Produced_By")}
                >
                  Planned Time
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Quantity")}>
                <TableSortLabel
                  active={sortConfig.key === "Quantity"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Quantity")}
                >
                  Remaining days
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
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map(
                (
                  {
                    id,
                        varieties,
                        batchId,
                        daysSinceSeeding,
                        seedingDate,
                        remain,
                        qty,
                        seeding,
                        growing,
                        dumped,
                  },
                  index
                ) => (
                  
                  <TableRow key={id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><Link href={`/crops/${id}`}>{varieties}</Link></TableCell>
                    <TableCell>{batchId}</TableCell>
                    <TableCell>{seedingDate}</TableCell>
                    <TableCell>{daysSinceSeeding} Days</TableCell>
                    <TableCell>{remain} Days</TableCell>
                    <TableCell>{qty} Pots</TableCell>
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
            </Tab>
            <Tab eventKey="archives" title="Archives">
             
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ModalContainer
        title="Update Crop"
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={addCrops}
      >
        <>
          <small className="text-muted">
            Crop Batch is a quantity or consignment of crops done at one time.
          </small>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Select activity type of this crop batch</Form.Label>
              <Form.Check
                name="activity"
                type="radio"
                label="Seeding"
                defaultChecked
              />
              <Form.Check name="activity" type="radio" label="Growing" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Area</Form.Label>
              <Form.Select onChange={(e) => setArea(e.target.value)}>
                <option>Select Area to Grow</option>
                <option value="1">Organic Lettuce</option>
                <option value="2">Organic Chilli</option>
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
                  <Form.Label>Plant Type</Form.Label>
                  <Form.Select onChange={(e) => setPlantType(e.target.value)}>
                    <option>Select Plant Type</option>
                    <option value="1">Vegetable</option>
                  </Form.Select>
                  {isError && (
                    <Form.Text className="text-danger">
                      The plant type field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Crop Variety</Form.Label>
                  <Form.Select onChange={(e) => setVariety(e.target.value)}>
                    <option>Select Crop Variety</option>
                    <option value="1">Romaine</option>
                  </Form.Select>
                  {isError && (
                    <Form.Text className="text-danger">
                      The crop variety field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Container Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The container quantity field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Container Type</Form.Label>
                  <Form.Select onChange={(e) => setType(e.target.value)}>
                    <option>Select Unit</option>
                    <option value="1">Pots</option>
                    <option value="2">Trays</option>
                  </Form.Select>
                  {isError && (
                    <Form.Text className="text-danger">
                      The container type field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </>
      </ModalContainer>
    </Layout>
  );
};

export default Crops;
