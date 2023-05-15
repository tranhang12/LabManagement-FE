import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Col, Container, Form, Nav, Row, Table } from "react-bootstrap";
import withAuth from "@/middleware/withAuth";
import { Pagination } from "react-bootstrap";
import Layout from "components/Layout";
import Panel from "components/Panel";
import { dashboardData } from "@/data/index";
import apiClient from "@/services/apiClient";
import { selectAuthState } from "@/store/auth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Root: NextPage = () => {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  useEffect(() => {
    if (!accessToken) {
      router.replace("auth/login");
    }
  }, [accessToken, router]);

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
    } else if (name === "Culture Plans") {
      return counts.culturePlanCount || 0;
    } else if (name === "Tasks") {
      return counts.tasksCount || 0;
    }
    return 0;
  };

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [cropsData, setCropsData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/culturePlan", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        setCropsData(response.data.result);
        setTotalPages(Math.ceil(response.data.result.length / limit));
      } else {
        console.error("Error fetching Crop: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Crop: " + error);
    }
  }, [accessToken, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        <Panel title="What is on Production" md={6} lg={6}>
          <>
            <div className="mb-3">
              <Link href="/crops">See all Crops</Link>
            </div>
            <Table responsive>
              <thead>
                <tr>
                  <th>BatchID</th>
                  <th>Plants</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cropsData &&
                  cropsData
                    .slice((page - 1) * limit, page * limit)
                    .map(
                      ({
                        Culture_Plan_ID,
                        BatchID,
                        Plant_Type,
                        Current_Quantity,
                        Container_Type,
                      }) => (
                        <tr key={Culture_Plan_ID}>
                          <td>
                            <Link href={`/crops/${Culture_Plan_ID}`}>
                              {BatchID}
                            </Link>
                          </td>
                          <td>{Plant_Type}</td>
                          <td>
                            {Current_Quantity} {Container_Type}
                          </td>
                        </tr>
                      )
                    )}
              </tbody>
            </Table>
            <Container className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setPage((page) => Math.max(page - 1, 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    setPage((page) => Math.min(page + 1, totalPages))
                  }
                />
              </Pagination>
            </Container>
          </>
        </Panel>
      </Row>
      <Row>
        {/* <Panel title="Tasks">
          <>
            <div className="mb-3">
              <Link href="/tasks">See all Tasks</Link>
            </div>
            <Table responsive>
              <thead>
                <tr>
                  <th />
                  <th className="w-75">Items</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {tasksData &&
                  tasksData.map(
                    ({ id, item, details, dueDate, priority, category }) => (
                      <tr key={id}>
                        <td>
                          <Form>
                            <Form.Check type="checkbox" />
                          </Form>
                        </td>
                        <td>
                          <TableTaskItem
                            id={id}
                            item={item}
                            details={details}
                            dueDate={dueDate}
                            priority={priority}
                          />
                        </td>
                        <td>
                          <span className="text-uppercase">{category}</span>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </Table>
          </>
        </Panel> */}
      </Row>
    </Layout>
  );
};

export default withAuth(Root);
