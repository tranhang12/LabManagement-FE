import { useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { Toast } from "react-bootstrap";

import { signUp } from "@/services/auth";
import ButtonIcon from "components/ButtonIcon";
import { useForm } from "react-hook-form";
import { useNotification } from '@/hooks/useNotification';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface FormData {
  userName: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

const Register: NextPage = () => {
  const router = useRouter();
  const {
    register,
    trigger,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();


  const { notification, handleCloseSnackbar, showNotification } = useNotification();
  const onSubmit = async (data: FormData) => {
    const { userName, password, fullName, phoneNumber } = data;

    try {
      const response = await signUp({
        userName,
        password,
        fullName,
        phoneNumber,
        isAdmin: 0,
      });
  
      if (response.status) {
        showNotification('success', 'Sign up successful');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        showNotification('error', response.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        showNotification('error', `Error in signUp: ${error.response.data.message}`);
      } else {
        const errorMessage = (error as Error).message;
        showNotification('error', `Error in signUp: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="bg-gray d-flex align-items-center vh-100">
      <Snackbar
        open={notification.snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.snackbarSeverity} sx={{ width: '100%' }}>
          {notification.snackbarMessage}
        </Alert>
      </Snackbar>
      <Container fluid>
        <Row>
          <Col sm={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Card>
              <Card.Body>
                <div className="text-center">
                  <Image
                    alt="LabOne logo"
                    src={"/img/LabOne_logo.png"}
                    width={150}
                    height={150}
                  />
                  <h4 className="py-3">Let&apos;s setup your account</h4>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      placeholder="Enter your username"
                      type="text"
                      {...register("userName", {
                        required: true,
                        minLength: 6,
                        pattern:
                        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
                      })}
                      onBlur={() => {
                        trigger("userName");
                      }}
                      // onChange={() => clearErrors("userName")}
                    />
                    {errors.userName && (
                      <Form.Text className="text-danger">
                        {errors.userName.type === "required"
                          ? "The username field is required"
                          : errors.userName.type === "minLength"
                          ? "The username must be at least 6 characters long"
                          : "The username must contain at least one non-numeric character"}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      placeholder="Enter your password"
                      type="password"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                      onBlur={() => trigger("password")}
                    />
                    {errors.password && (
                      <Form.Text className="text-danger">
                        {errors.password.type === "required"
                          ? "The password field is required"
                          : "The password must be at least 6 characters long"}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      placeholder="Enter your Full name"
                      type="text"
                      {...register("fullName", {
                        required: true,
                        minLength: 6,
                        pattern:
                          /^[a-zA-Z\sàáạãảâầấậẫẩăằắặẵẳèéẹẽẻêềếệễểìíịĩỉòóọõỏôồốộỗổơờớợỡởùúụũủưừứựữửỳýỵỹỷđĐ]+$/,
                      })}
                      onBlur={() => trigger("fullName")}
                    />
                    {errors.fullName && (
                      <Form.Text className="text-danger">
                        {errors.fullName.type === "required"
                          ? "The Full Name field is required"
                          : errors.fullName.type === "minLength"
                          ? "The Full Name must be at least 6 characters long"
                          : "The Full Name must only contain alphabetical characters and spaces"}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      placeholder="e.g. 0982635213"
                      type="phone"
                      {...register("phoneNumber", {
                        required: true,
                        pattern: /^[0-9]{9,14}$/,
                      })}
                      onBlur={() => trigger("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <Form.Text className="text-danger">
                        {errors.phoneNumber.type === "required"
                          ? "The Phone Number field is required"
                          : "The Phone Number is invalid (must contain 9-14 digits)"}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <div className="text-center mt-4">
                    <ButtonIcon
                      label="Create account"
                      icon={<FaUserPlus className="me-1" />}
                      type="submit"
                      variant="primary"
                    />
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Register;
