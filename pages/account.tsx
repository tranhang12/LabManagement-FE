import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import { Card, Col, Form, Row, Alert } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

import ButtonIcon from "../components/ButtonIcon";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import withAuth from "@/middleware/withAuth";
import withRole from "@/middleware/withRole";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/auth";

const Account: NextPage = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await apiClient.get("/users/currentUser", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
        setPhoneNumber(response.data.user.phoneNumber);
      } else {
        console.error("Error fetching current user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching current user: " + error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const changePassword = async () => {
    if (!oldPassword || !password) {
      setIsError(true);
      setErrorMessage("The old password and new password fields are required");
    } else if (password !== confirmPassword) {
      setErrorMessage("The new password and confirm password do not match");
    } else {
      setIsError(false);
      setErrorMessage("");

      try {
        const response = await apiClient.put(
          "/users/resetPassword",
          {
            oldPassword,
            newPassword: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Kiểm tra kết quả của yêu cầu đặt lại mật khẩu
        if (response.data.status) {
          // Xử lý thành công đặt lại mật khẩu
          setErrorMessage("");
          setSuccessMessage("Password reset successfully");
          setOldPassword(""); // Clear old password field
          setPassword(""); // Clear new password field
          setConfirmPassword(""); // Clear confirm password field
        } else {
          // Xử lý khi đặt lại mật khẩu thất bại
          setSuccessMessage("");
          setErrorMessage("Password reset failed: " + response.data.message);
        }
      } catch (error) {
        console.error("Error resetting password: " + error);
        setErrorMessage("Error resetting password: " + error);
        setSuccessMessage("");
      }
    }
  };

  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Account Settings</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Card>
            <Card.Body>
              <Form>
                {successMessage && (
                  <Alert
                    variant="secondary"
                    onClose={() => setSuccessMessage("")}
                    dismissible
                  >
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert
                    variant="danger"
                    onClose={() => setErrorMessage("")}
                    dismissible
                  >
                    {errorMessage}
                  </Alert>
                )}

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" readOnly value={username} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="text" readOnly value={email} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control type="text" readOnly value={phoneNumber} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Old Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      {isError && (
                        <Form.Text className="text-danger">
                          The old password field is required
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {isError && (
                        <Form.Text className="text-danger">
                          The password field is required
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <ButtonIcon
                  label="Save"
                  icon={<FaCheck className="me-1" />}
                  variant="secondary"
                  onClick={changePassword}
                  textColor="text-light"
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default withAuth(withRole([0])(Account));
