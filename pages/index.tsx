import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Col, Form, Nav, Row, Table } from "react-bootstrap";
import withAuth from "@/middleware/withAuth";

import Layout from "components/Layout";
import Panel from "components/Panel";
import { dashboardData } from "@/data/index";
import apiClient from "@/services/apiClient";

const Root: NextPage = () => {
  const [counts, setCounts] = useState({
    areaCount: 0,
    culturePlanCount: 0,
    tasksCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/recordCounts");
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  const displayCount = (name: string) => {
    if (name === "Areas") {
      return counts.areaCount || 0;
    } else if (name === "Varieties") {
      return counts.culturePlanCount || 0;
    } else if (name === "Tasks") {
      return counts.tasksCount || 0;
    }
    return 0;
  };
  
  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Dashboard</h3>
        </Col>
      </Row>
      <Row>
        <Panel title="In a nutshell" md={6} lg={6}>
          <Nav className="flex-column">
            {dashboardData.map(({ name, route, icon }, index) => (
              <Nav.Item key={name} className="mb-1">
                <div className="d-flex align-items-center">
                  {icon}
                  <Link href={route}>
                  {displayCount(name)} {name}
                  </Link>
                </div>
              </Nav.Item>
            ))}
          </Nav>
        </Panel>
      </Row>
    </Layout>
  );
};

export default withAuth(Root);
