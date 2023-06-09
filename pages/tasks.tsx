import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import {
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import Link from "next/link";
import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Panel from "../components/Panel";
import { iTableTaskItem } from "../components/TableTaskItem";
import TableTaskItem from "../components/TableTaskItem";
import Layout from "../components/Layout";
import useModal from "../src/hooks/useModal";
import apiClient from "@/services/apiClient";
import { selectAuthState } from "../src/store/auth";
import { useSelector } from "react-redux";

const Tasks: NextPage = () => {
  const resetFields = () => {
    setSelectedCategory("");
    setTitle("");
    setPriority("");
    setDueDate("");
    setDesc("");
  };
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isError, setIsError] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filter, setFilter] = useState("Incomplete");
  const [data, setData] = useState<iTableTaskItem | any>([]);
  const [counter, setCounter] = useState(0);
  const target = useRef(null);
  const { accessToken } = useSelector(selectAuthState);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `/tasks/allTask?Status=${filter}&&Priority=${filterPriority}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const tasks = response.data.result;
        setData(tasks);
        setTotalPages(Math.ceil(tasks.length / limit));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken, filterCategory, filterPriority, filter, counter, limit]);
  //handle checkbox
  const handleCheckbox = async (e: any, taskId: number) => {
    e.preventDefault();
    try {
      await apiClient.put(
        `/tasks/task/${taskId}`,
        {
          Status: "Completed",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCounter((counter) => counter + 1);
    } catch (err) {
      console.log(err);
    }
  };

  //get user
  type User = {
    User_Name: string;
  };
  const [allUsers, setAllUsers] = useState<User[]>([]);
  //get all users
  useEffect(() => {
    apiClient
      .get("users/getAllUsers")
      .then((res) => res.data)
      .then((data) => setAllUsers(data.users));
  }, []);

  //add new task
  const addTask = async () => {
    if (!dueDate || !priority || !title || !assignedTo) {
      setIsError(true);
    } else {
      try {
        const response = await apiClient.post(
          "/tasks/task",
          {
            Task_Category: selectedCategory,
            Title: title,
            Description: desc,
            Priority: priority,
            Due_Date: dueDate,
            Assigned_To: assignedTo,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCounter((counter) => counter + 1);
        closeModal();
      } catch (err) {
        setIsError(true);
      }
    }
  };

  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Tasks</h3>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3">
          <ButtonIcon
            label="Add Task"
            icon={<FaPlus className="me-2" />}
            onClick={showModal}
            variant="primary"
          />
        </Col>
      </Row>
      <Row>
        <Panel md={9} lg={8} title="Tasks">
          <>
            <Table responsive>
              <thead>
                <tr>
                  <th />
                  <th className="w-60">Items</th>
                  <th>Category</th>
                  <th>Assigned to</th>
                  <th>Culture Plan</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.slice((page - 1) * limit, page * limit).map(
                    ({
                      Task_ID,
                      Title,
                      Description,
                      Due_Date,
                      Priority,
                      Task_Category,
                      Assigned_To,
                      BatchID,
                      Culture_Plan_ID: Culture_Plan_ID,
                    }: iTableTaskItem) => (
                      <tr key={Task_ID}>
                        <td>
                          <Form>
                            <Form.Check
                              type="checkbox"
                              onChange={(e) => handleCheckbox(e, Task_ID)}
                            />
                          </Form>
                        </td>
                        <td>
                          <TableTaskItem
                            Task_ID={Task_ID}
                            Title={Title}
                            Description={Description}
                            Due_Date={new Date(Due_Date).toLocaleDateString()}
                            Priority={Priority}
                          />
                        </td>
                        <td>
                          <span className="text-uppercase">
                            {Task_Category}
                          </span>
                        </td>
                        <td>
                          <span className="text-uppercase">{Assigned_To}</span>
                        </td>
                        <td>
                          <span className="text-uppercase">
                            <Link href={`/crops/${Culture_Plan_ID}`}>
                              {BatchID}
                            </Link>
                          </span>
                        </td>
                        <td>
                          <FaEdit
                            onClick={showModal}
                            className="show-pointer"
                          />
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
        <Col md={3} lg={4}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="" selected>
                  All
                </option>
                <option value="Area">Area</option>
                <option value="Crop">Crop</option>
                <option value="General">General</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="" selected>
                  All
                </option>
                <option value="urgent">Urgent</option>
                <option value="normal">Normal</option>
              </Form.Select>
            </Form.Group>
            <ListGroup>
              <ListGroupItem
                className="text-info show-pointer"
                active={filter === "completed"}
                onClick={() => setFilter("Completed")}
              >
                Completed
              </ListGroupItem>
              <ListGroupItem
                className="text-muted show-pointer"
                active={filter === "incomplete"}
                onClick={() => setFilter("Incomplete")}
              >
                Incomplete
              </ListGroupItem>
              <ListGroupItem
                className="text-danger show-pointer"
                active={filter === "overdue"}
                onClick={() => setFilter("Overdue")}
              >
                Overdue
              </ListGroupItem>
              <ListGroupItem
                className="text-secondary show-pointer"
                active={filter === "today"}
                onClick={() => setFilter("Today")}
              >
                Today
              </ListGroupItem>
              <ListGroupItem
                className="show-pointer"
                active={filter === "week"}
                onClick={() => setFilter("Week")}
              >
                This Week
              </ListGroupItem>
              <ListGroupItem
                className="show-pointer"
                active={filter === "month"}
                onClick={() => setFilter("Month")}
              >
                This Month
              </ListGroupItem>
            </ListGroup>
          </Form>
        </Col>
      </Row>
      <ModalContainer
        title="Add New Task"
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={addTask}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <InputGroup ref={target}>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </InputGroup>
            {isError && (
              <Form.Text className="text-danger">
                The due date field is required
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Is this task urgent?</Form.Label>
            <Form.Check
              type="radio"
              label="Yes"
              name="priority"
              onChange={() => setPriority("urgent")}
            />
            <Form.Check
              type="radio"
              label="No"
              name="priority"
              onChange={() => setPriority("normal")}
            />
            {isError && (
              <Form.Text className="text-danger">
                The priority field is required
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Category</Form.Label>
            <Form.Select onChange={(e) => setSelectedCategory(e.target.value)}>
              <option>Please select category</option>
              <option value="Move">Move</option>
              <option value="Harvest">Harvest</option>
              <option value="Dump">Dump</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            {isError && (
              <Form.Text className="text-danger">
                The title field is required
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Assign to</Form.Label>
            <Form.Select onChange={(e) => setAssignedTo(e.target.value)}>
              <>
                <option value="">Please select assignee</option>
                {(allUsers || []).map((user) => (
                  <option key={user.User_Name} value={user.User_Name}>
                    {user.User_Name}
                  </option>
                ))}
              </>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              style={{ height: "120px" }}
            />
          </Form.Group>
        </Form>
      </ModalContainer>
    </Layout>
  );
};

export default Tasks;
