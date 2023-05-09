import { useRef, useState, useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import {
  FaLongArrowAltLeft,
  FaPlus,
  FaUtensilSpoon,
  FaTrash,
  FaPaperPlane,
  FaCamera,
  FaCut,
  FaExchangeAlt,
} from "react-icons/fa";

import ButtonIcon from "../../components/ButtonIcon";
import ModalContainer from "../../components/ModalContainer";
import Panel from "../../components/Panel";
import Layout from "../../components/Layout";
import useModal from "../../src/hooks/useModal";
import { iTableTaskItem } from "../../components/TableTaskItem";
import apiClient from "@/services/apiClient";
import {toast} from 'react-toastify'
import { useRouter } from "next/router";

const CropDetail: NextPage = () => {
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

  ///Move Culture_plan
  const [modalMoveOpen, setModalMoveOpen] = useState(false);
  const [moveSource, setMoveSource] = useState("");
  const [moveDest, setMoveDest] = useState("");
  const [moveQty, setMoveQty] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  // const [selectedCulturePlanID, setSelectedCulturePlanID] = useState(null); // Sử dụng state biến hoặc biến khác để lấy Culture_Plan_ID
  const routes = useRouter()
  const {id : selectedCulturePlanID} = routes.query

  const handleSubmit = async () => {
    try {
      const payload = {
        Culture_Plan_ID: +selectedCulturePlanID!,
        Area_Name: moveDest,
        Initial_Quantity: moveQty,
        Current_Quantity: moveQty,
        Transition_Time: new Date().toISOString().split("T")[0],
        Remaining_Days: remainingDays,
      };
      const response = await apiClient.post("/moveCrop", payload);

      if (response.status === 201) {
        toast.success("Crop moved successfully");
        
      } else {
        toast.error("An error occurred while moving the crop")
      }
    } catch (error) {
      toast.error("An error occurred while moving the crop")
      console.error(error);
    } finally {
      setModalMoveOpen(false);
    }
  };

  type Area = {
    Area_Name: string;
  };

  const [areasWithCulturePlan, setAreasWithCulturePlan] = useState<Area[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);

  const addTask = () => {
    if (!dueDate || !priority || !title) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
    }
  };

  // Harvest Modal
  const [modalHarvestOpen, setModalHarvestOpen] = useState(false);
  const [harvestArea, setHarvestArea] = useState("");
  const [harvestType, setHarvestType] = useState("");
  const [harvestQty, setHarvestQty] = useState("");
  const [harvestUnit, setHarvestUnit] = useState("");
  const [harvestNotes, setHarvestNotes] = useState("");

  // Move Modal
  // const [modalMoveOpen, setModalMoveOpen] = useState(false);
  // const [moveSource, setMoveSource] = useState("");
  // const [moveDest, setMoveDest] = useState("");
  // const [moveQty, setMoveQty] = useState(0);

  // Dump Modal
  const [modalDumpOpen, setModalDumpOpen] = useState(false);
  const [dumpArea, setDumpArea] = useState("");
  const [dumpQty, setDumpQty] = useState(0);
  const [dumpNotes, setDumpNotes] = useState("");

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

  useEffect(() => {
    apiClient.get("/areas-with-culture-plan")
      .then((res) => res.data)
      .then((data) => setAreasWithCulturePlan(data));

    apiClient.get("/all-areas")
    .then((res) => res.data)
    .then((data) => setAllAreas(data));
  }, []);

  return (
    <Layout>
      <Row>
        <Col className="mb-3">
          <Link href="/crops">
            <ButtonIcon
              label="Back to Crops Batches"
              icon={<FaLongArrowAltLeft className="me-2" />}
              onClick={() => {}}
              variant="link"
              textColor="#358a51"
            />
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs defaultActiveKey="basic">
            <Tab eventKey="basic" title="Basic Info">
              <h3 className="py-3">Asparagus plant</h3>
              <Row>
                <Col className="mb-3">
                  <small>Batch ID</small>
                  <div>
                    <strong>As-20mar</strong>
                  </div>
                </Col>
                <Col className="mb-3">
                  <small>Initial Planning</small>
                  <div>
                    <strong>50 Post Lab 01</strong>
                  </div>
                </Col>
              </Row>
              <Row>
                {/* <Col className="mb-3">
                  <small>Status</small>
                  <div>
                    <strong>0 Seeding, 777 Growing, 0 Dumped</strong>
                  </div>
                </Col> */}
                <Col className="mb-3">
                  <small>Current Quantity</small>
                  <div>
                    <strong>50 Post on Lab 02</strong>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <small>Start Date</small>
                  <div>
                    <strong>24/03/2022</strong>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <small>Remaining days</small>
                  <div>
                    <strong>7 days</strong>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <div className="d-grid gap-2">
                    <ButtonIcon
                      label="Harvest"
                      icon={<FaCut className="me-2" />}
                      onClick={() => setModalHarvestOpen(true)}
                      variant="secondary"
                      isBlock
                    />
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="d-grid gap-2">
                    <ButtonIcon
                      label="Move"
                      icon={<FaExchangeAlt className="me-2" />}
                      onClick={() => setModalMoveOpen(true)}
                      variant="primary"
                      isBlock
                    />
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="d-grid gap-2">
                    <ButtonIcon
                      label="Dump"
                      icon={<FaTrash className="me-2" />}
                      onClick={() => setModalDumpOpen(true)}
                      variant="danger"
                      isBlock
                    />
                  </div>
                </Col>
              </Row>
            </Tab>
            {/* <Tab eventKey="notes" title="Tasks &amp; Notes">
              <Row>
                <Panel title="Tasks">
                  <>
                    <div className="mb-3">
                      <ButtonIcon
                        label="Add Task"
                        icon={<FaPlus className="me-2" />}
                        onClick={() => showModal()}
                        variant="primary"
                      />
                    </div>
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
                      Assigned_To
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
                          <span className="text-uppercase">{Task_Category}</span>
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
                <Panel title="Notes">
                  <>
                    <InputGroup className="mb-3">
                      <Form.Control type="text" placeholder="Create a note" />
                      <Button variant="secondary">
                        <div className="d-flex align-items-center">
                          <FaPaperPlane />
                        </div>
                      </Button>
                    </InputGroup>
                    <ListGroup>
                      {notesData &&
                        notesData.map(({ id, title, createdOn }) => (
                          <ListGroup.Item key={id}>
                            <div className="d-flex align-items-center justify-content-between py-1">
                              <div>
                                <div className="mb-1">{title}</div>
                                <small className="text-muted">
                                  {createdOn}
                                </small>
                              </div>
                              <div>
                                <FaTrash />
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </>
                </Panel>
              </Row>
            </Tab> */}
          </Tabs>
        </Col>
      </Row>
      <ModalContainer
        title="Crop: Add New Task from rom-24mar"
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
              <option value="1">Reservoir</option>
              <option value="2">Pest Control</option>
              <option value="3">Safety</option>
              <option value="4">Sanitation</option>
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
            <Form.Select onChange={(e) => setSelectedCategory(e.target.value)}>
              <option>Please select assignee</option>
              <option value="Move">Move</option>
              <option value="Harvest">Harvest</option>
              <option value="Dump">Dump</option>
              <option value="Other">Other</option>
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

      <ModalContainer
        title="Harvest rom-24mar"
        isShow={modalHarvestOpen}
        handleCloseModal={() => setModalHarvestOpen(false)}
        handleSubmitModal={() => setModalHarvestOpen(false)}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Choose area to be harvested</Form.Label>
            <Form.Select onChange={(e) => setHarvestArea(e.target.value)}>
              <option>Please select area</option>
              <option value="1">Organic lettuce</option>
              <option value="2">Organic chilli</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Choose type of harvesting</Form.Label>
            <Form.Select onChange={(e) => setHarvestType(e.target.value)}>
              <option>All</option>
              <option value="1">Partial</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="input"
              value={harvestQty}
              onChange={(e) => setHarvestQty(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Units</Form.Label>
            <Form.Select onChange={(e) => setHarvestUnit(e.target.value)}>
              <option value="1">Grams</option>
              <option value="2">Kilograms</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              onChange={(e) => setHarvestNotes(e.target.value)}
              value={harvestNotes}
              style={{ height: "120px" }}
            />
          </Form.Group>
        </Form>
      </ModalContainer>

      <ModalContainer
        title="Move As-20mar"
        isShow={modalMoveOpen}
        handleCloseModal={() => setModalMoveOpen(false)}
        handleSubmitModal={handleSubmit}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select source area</Form.Label>
            <Form.Select onChange={(e) => setMoveSource(e.target.value)}>
              <option>Please select area</option>
              {areasWithCulturePlan.map((area) => (
                <option key={area.Area_Name} value={area.Area_Name}>
                  {area.Area_Name}
                </option>
              ))}
            </Form.Select>
            <Form.Group className="mb-3">
              <Form.Label>Select destination area</Form.Label>
              <Form.Select onChange={(e) => setMoveDest(e.target.value)}>
                <option>Please select area</option>
                {allAreas.map((area) => (
                  <option key={area.Area_Name} value={area.Area_Name}>
                    {area.Area_Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form.Group>
          <Form.Group className="mb-3">
           
            <Form.Label>{`How many plants do you want to move?`}</Form.Label>
           
            <input
              type="number"
              defaultValue={0}
              onChange={(e) => setMoveQty(Number(e.target.value))}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
                width: "100%",
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            {/* <Form.Label>{`How many plants do you want to move? (${moveQty})`}</Form.Label> */}
            <Form.Label>{`Expected cell culture duration? (days)`}</Form.Label>
            {/* <Form.Range
              value={moveQty}
              onChange={(e) => setMoveQty(Number(e.target.value))}
            /> */}
            <input
              type="number"
              defaultValue={0}
              onChange={(e) => setMoveQty(Number(e.target.value))}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
                width: "100%",
              }}
            />
          </Form.Group>
        </Form>
      </ModalContainer>

      <ModalContainer
        title="Dump rom-24mar"
        isShow={modalDumpOpen}
        handleCloseModal={() => setModalDumpOpen(false)}
        handleSubmitModal={() => setModalDumpOpen(false)}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Choose area</Form.Label>
            <Form.Select onChange={(e) => setDumpArea(e.target.value)}>
              <option>Please select area</option>
              <option value="1">Organic lettuce</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{`How many plants do you want to dump? (${dumpQty})`}</Form.Label>
            <Form.Range
              value={moveQty}
              onChange={(e) => setDumpQty(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              onChange={(e) => setDumpNotes(e.target.value)}
              value={dumpNotes}
              style={{ height: "120px" }}
            />
          </Form.Group>
        </Form>
      </ModalContainer>
    </Layout>
  );
};

export default CropDetail;
