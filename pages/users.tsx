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
const Users: NextPage = () => {
  const resetFields = () => {
    setUserName("");
    setFullName("");
    setPhoneNumber("");
    setPassword("");
    setEmail("");
    setIsAdmin(false);
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  interface IUser {
    User_ID: number;
    User_Name: string;
    Full_Name: string;
    Phone_Number: string;
    User_Password: string;
    email: string;
    Is_Admin: number;
  }

  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  const [userData, setUserData] = useState([]);
  const fetchUserData = useCallback(async () => {
    try {
      const response = await apiClient.get("/users/getAllUsers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setUserData(response.data.users);
      } else {
        console.error("Error fetching current user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching current user: " + error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
    // await apiClient.delete(`/users/deleteUser/${id}`);
    const response = await apiClient.delete(
      `/users/deleteUser/${item.User_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // refresh data
    fetchUserData();
    // close modal
    handleCloseConfirmModal();
    resetFields();
  };

  // EDIT USER
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);

    // Set the default values for the input fields
    setUserName(user.User_Name);
    setFullName(user.Full_Name);
    setPhoneNumber(user.Phone_Number);
    setPassword(user.User_Password);
    setEmail(user.email);
    setIsAdmin(user.Is_Admin === 1);

    setIsAddingUser(false);
    showModal();
  };

  const handleSaveUser = async () => {
    if (!editingUser) {
      console.error("No user selected for editing");
      return;
    }
    // Validate user input and call API to update user information
    try {
      const response = await apiClient.put(
        `/users/updateUserInfo/${editingUser?.User_ID}`,
        {
          User_Name: userName,
          Full_Name: fullName,
          Phone_Number: phoneNumber,
          User_Password: password,
          email: email,
          Is_Admin: isAdmin ? 1 : 0,
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
        fetchUserData();
        console.log(response);

        // Close modal and reset editingUser
        closeModal();
        resetFields();
        setEditingUser(null);
      } else {
        console.error("Error updating user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating user: " + error);
    }
  };

  // ADD USER
  const [isAddingUser, setIsAddingUser] = useState(false);
  const handleAddUser = () => {
    setIsAddingUser(true);
    showModal();
  };
  const handleCreateUser = async () => {
    // Validate user input and call API to create a new user
    try {
      const response = await apiClient.post(
        "/users/createUser",
        {
          User_Name: userName,
          Full_Name: fullName,
          Phone_Number: phoneNumber,
          User_Password: password,
          email: email,
          Is_Admin: isAdmin ? 1 : 0,
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
        fetchUserData();
        console.log(response);

        // Close modal and reset editingUser
        closeModal();
        resetFields();
        setIsAddingUser(false);
      } else {
        console.error("Error creating user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating user: " + error);
    }
  };

  const itemsPerPage = 5;

  const { sortedData, requestSort, sortConfig, handleRequestSort } =
    useSortData(userData);
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
          <h3 className="pb-3">User Management</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add user"
            icon={<FaPlus className="me-2" />}
            onClick={handleAddUser}
            variant="primary"
          />
        </Col>
      </Row>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCellWidth>#</StyledTableCellWidth>
              <StyledTableCell onClick={() => handleRequestSort("User_Name")}>
                <TableSortLabel
                  active={sortConfig.key === "User_Name"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("User_Name")}
                >
                  UserName
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Full_Name")}>
                <TableSortLabel
                  active={sortConfig.key === "Full_Name"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Full_Name")}
                >
                  Full name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                onClick={() => handleRequestSort("Phone_Number")}
              >
                <TableSortLabel
                  active={sortConfig.key === "Phone_Number"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Phone_Number")}
                >
                  Phone Number
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("email")}>
                <TableSortLabel
                  active={sortConfig.key === "email"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("email")}
                >
                  Email
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell onClick={() => handleRequestSort("Role")}>
                <TableSortLabel
                  active={sortConfig.key === "Role"}
                  direction={sortConfig.direction}
                  onClick={() => handleRequestSort("Role")}
                >
                  Role
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map((item, index) => (
                <TableRow key={item.User_ID}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{item.User_Name}</TableCell>
                  <TableCell>{item.Full_Name}</TableCell>
                  <TableCell>{item.Phone_Number}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    {item.Is_Admin === 1 ? "Manager" : "Employee"}
                  </TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => handleEditUser(item as IUser)}
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
        title={isAddingUser ? "Add User" : "Edit User"}
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={isAddingUser ? handleCreateUser : handleSaveUser}
      >
        <>
          <Form>
            <Form.Group controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
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

export default withAuth(withRole([1])(Users));
