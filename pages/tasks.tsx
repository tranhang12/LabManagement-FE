import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import {
  Col,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
} from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Panel from "../components/Panel";
import { iTableTaskItem } from "../components/TableTaskItem";
import TableTaskItem from "../components/TableTaskItem";
import Layout from "../components/Layout";
import useModal from "../src/hooks/useModal";
import apiClient from "@/services/apiClient";

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
  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isError, setIsError] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<iTableTaskItem | any>([]);
  const target = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/tasks/allTask");
        const tasks = response.data.result;
        setData(tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filterCategory, filterPriority, filter]);

  //get user
  type User = {
    User_Name: string;
    }
    const [allUsers, setAllUsers] = useState<User[]>([]);
      //get all users
      useEffect(() => {
        apiClient.get("users/getAllUsers")
        .then((res) => res.data)
        .then((data) => setAllUsers(data.users));
      }, []);

  const addTask = () => {
    if (!dueDate || !priority || !title) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
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
                  <th />
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map(
                    ({
                      id,
                      Title,
                      Description,
                      Due_Date,
                      Priority,
                      Task_Category,
                      Assigned_To,
                    }: iTableTaskItem) => (
                      <tr key={id}>
                        <td>
                          <Form>
                            <Form.Check type="checkbox" />
                          </Form>
                        </td>
                        <td>
                          <TableTaskItem
                            id={id}
                            Title={Title}
                            Description={Description}
                            Due_Date={Due_Date}
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
                onClick={() => setFilter("completed")}
              >
                Completed
              </ListGroupItem>
              <ListGroupItem
                className="text-muted show-pointer"
                active={filter === "incomplete"}
                onClick={() => setFilter("incomplete")}
              >
                Incomplete
              </ListGroupItem>
              <ListGroupItem
                className="text-danger show-pointer"
                active={filter === "overdue"}
                onClick={() => setFilter("overdue")}
              >
                Overdue
              </ListGroupItem>
              <ListGroupItem
                className="text-secondary show-pointer"
                active={filter === "today"}
                onClick={() => setFilter("today")}
              >
                Today
              </ListGroupItem>
              <ListGroupItem
                className="show-pointer"
                active={filter === "week"}
                onClick={() => setFilter("week")}
              >
                This Week
              </ListGroupItem>
              <ListGroupItem
                className="show-pointer"
                active={filter === "month"}
                onClick={() => setFilter("month")}
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
        <>
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
              <Form.Select
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
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
              <Form.Select
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {allUsers.map((user) => (
                <option key={user.User_Name} value={user.User_Name}>
                  {user.User_Name}
                </option>
              ))}
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
        </>
      </ModalContainer>
    </Layout>
  );
};

export default Tasks;
