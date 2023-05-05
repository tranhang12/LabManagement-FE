import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { FaUnlock } from "react-icons/fa";
import ButtonIcon from "components/ButtonIcon";

import { login } from "@/store/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";

type LoginForm = {
  userName: string;
  password: string;
};

const LogIn: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setShowError(false);
    }
  }, [errors]);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    dispatch(login(data))
      .then(unwrapResult)
      .then(() => router.push("/"))
      .catch((error) => {
        console.error(error);
        setShowError(true);
      });
  };


  return (
    <div className="bg-gray d-flex align-items-center vh-100">
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
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ float: "left" }}>Username:</div>
                        <div
                          style={{
                            float: "right",
                            fontSize: "14px",
                            textAlign: "right",
                          }}
                        >
                          Need an account?{" "}
                          <p
                            style={{ display: "inline", color: "green" }}
                            onClick={() => {
                              router.push("/auth/register");
                            }}
                          >
                            Sign up
                          </p>
                        </div>
                      </div>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      {...register("userName", {
                        required: "The username field is required",
                      })}
                    />
                    {errors.userName && (
                      <Form.Text className="text-danger">
                        {errors.userName.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Your password"
                      {...register("password", {
                        required: "The password field is required",
                      })}
                    />
                    {errors.password && (
                      <Form.Text className="text-danger">
                        {errors.password.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  {showError && (
                    <Form.Text className="text-danger">
                      The username or password is incorrect!
                    </Form.Text>
                  )}
                  <div className="text-center mt-3">
                    <ButtonIcon
                      label="Login"
                      icon={<FaUnlock className="me-1" />}
                      type="submit"
                      variant="primary"
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      // onClick={}
                    >
                      Forgot password?
                    </button>
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

export default LogIn;
