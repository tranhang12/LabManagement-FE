// import { useState } from "react";
// import type { NextPage } from "next";
// import { Card, Col, Form, Row } from "react-bootstrap";
// import { FaCheck } from "react-icons/fa";

// import ButtonIcon from "../components/ButtonIcon";
// import Layout from "../components/Layout";

// const Account: NextPage = () => {
//   const [username, setUsername] = useState("");
//   const [oldPassword, setOldPassword] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isError, setIsError] = useState(false);

//   const changePassword = () => {
//     if (!oldPassword || !password) {
//       setIsError(true);
//     } else {
//       setIsError(false);
//     }
//   };

//   return (
//     <Layout>
//       <Row>
//         <Col>
//           <h3 className="pb-3">Account Settings</h3>
//         </Col>
//       </Row>
//       <Row>
//         <Col xs={12} sm={12} md={6}>
//           <Card>
//             <Card.Body>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Username</Form.Label>
//                   <Form.Control type="text" readOnly value={username} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Old Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={oldPassword}
//                     onChange={(e) => setOldPassword(e.target.value)}
//                   />
//                   {isError && (
//                     <Form.Text className="text-danger">
//                       The old password field is required
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   {isError && (
//                     <Form.Text className="text-danger">
//                       The password field is required
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Confirm Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </Form.Group>
//                 <ButtonIcon
//                   label="Save"
//                   icon={<FaCheck className="me-1" />}
//                   variant="secondary"
//                   onClick={changePassword}
//                   textColor="text-light"
//                 />
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Layout>
//   );
// };

// export default Account;


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
import { users } from "../data";
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

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await apiClient.get("/getAllUsers");
  //       setMaterials(response.data.result);
  //       console.log(response.data.result);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);
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
    useSortData(users);
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
          <h3 className="pb-3">User Management</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add user"
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
                  #
                </TableSortLabel>
              </StyledTableCellWidth>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === "Category"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Category")}
                >
                  UserName
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Name")}>
                <TableSortLabel
                  active={sortConfig.key === "Name"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Name")}
                >
                  Full name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Price")}>
                <TableSortLabel
                  active={sortConfig.key === "Price"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Price")}
                >
                  Phone Number
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Produced_By")}>
                <TableSortLabel
                  active={sortConfig.key === "Produced_By"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Produced_By")}
                >
                  Email
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Quantity")}>
                <TableSortLabel
                  active={sortConfig.key === "Quantity"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Quantity")}
                >
                  Role
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
                    User_ID,
                    User_Name,
                    Full_Name,
                    Phone_Number,
                    email,
                    Is_Admin
                  },
                  index
                ) => (
                  
                  <TableRow key={User_ID}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{User_Name}</TableCell>
                    <TableCell>{Full_Name}</TableCell>
                    <TableCell>{Phone_Number}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{Is_Admin === 1 ? "Manager" : "Employee"}</TableCell>
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
    </Layout>
  );
};

export default Material;

