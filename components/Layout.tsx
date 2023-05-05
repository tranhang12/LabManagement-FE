import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container, Col, Nav, Navbar, Row } from "react-bootstrap";
import { FaPowerOff } from "react-icons/fa";
import Cookies from 'js-cookie';

import Footer from "components/Footer";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState,logoutSuccess  } from '@/store/auth';
import withAuth from "@/middleware/withAuth";
import iNavData from "@/types/iNavData";
import { adminNavData, userNavData } from "@/data/index";


interface iLayout {
  children: React.ReactNode;
}

const Layout = ({ children }: iLayout) => {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();

  const userRole = authState.user?.Is_Admin;
  const displayNavData = userRole === 1 ? adminNavData : userNavData;

   const handleSignOut = () => {
    // Clear the session data from cookies
  Cookies.remove('accessToken');
  
  // Dispatch an action to clear the session state in the store
  dispatch(logoutSuccess());

  // Redirect the user to the login page
  router.push('/auth/login');
  };
  return (
    <Row className="mx-0">
      <Sidebar />
      <Col sm={12} md={9} lg={10} className="bg-gray px-0">
        <Navbar collapseOnSelect className="bg-light" expand="lg">
          <Navbar.Brand href="/">
            <div className="d-flex justify-content-center d-md-none">
              <Image alt="LabOne logo" src={"/img/LabOne_logo.png"} width={100} height={100} />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>

            <Nav className="d-md-none">
              {displayNavData &&
                displayNavData.map(({ name, route, icon }: iNavData) => (
                  <Nav.Item key={`mobile-${name}`}>
                    <Nav.Link href={route}>
                      <div className="d-flex align-items-center">
                        {icon}
                        <span>{name}</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                ))}
            </Nav>
            <div className="dropdown-divider d-md-none" />
            <Nav className="ms-auto">
              <Nav.Link onClick={handleSignOut}>
                <div className="d-flex align-items-center">
                  <FaPowerOff className="me-3" />
                    <span className="text-decoration-none">Sign Out</span>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid className="py-4">
          <div style={{ minHeight: "calc(100vh - 152px)" }}>{children}</div>
        </Container>
        <Footer />
      </Col>
    </Row>
  );
};

export default withAuth(Layout);
