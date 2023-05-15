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
  FaClone,
} from "react-icons/fa";

import ButtonIcon from "../../components/ButtonIcon";
import EditIcon from "@mui/icons-material/Edit";
import ModalContainer from "../../components/ModalContainer";
import Panel from "../../components/Panel";
import Layout from "../../components/Layout";
import useModal from "../../src/hooks/useModal";
import TableTaskItem, { iTableTaskItem } from "../../components/TableTaskItem";
import apiClient from "@/services/apiClient";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";
import { selectAuthState } from "../../src/store/auth";
import { useSelector } from "react-redux";
import BatchArea, { IBatchArea } from "../../components/BatchArea";

const CropDetail: NextPage = () => {
  const resetFields = () => {
    setSelectedCategory("");
    setTitle("");
    setPriority("");
    setDueDate("");
    setDesc("");
  };
  const { accessToken } = useSelector(selectAuthState);
  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
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
  const [transitionTime, setTransitionTime] = useState("");
  const [counter, setCounter] = useState(0)
  const routes = useRouter()
  interface ICrop {
    Culture_Plan_ID: number;
    Plant_Type: string;
    Area: string;
    // Container_Quantity: number;
    Container_Type: string;
    Transition_Time: string;
    BatchID: string;
    Created_Date: string;
    Task_ID: string;
    Status: string;
    Initial_Quantity: string;
    Current_Quantity: string;
    Remaining_Days: string;
  }

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

  const [crop, setCrop] = useState<ICrop | null>(null)

  const { id: selectedCulturePlanID } = routes.query
  useEffect(() => {
    if (selectedCulturePlanID) {
      apiClient.get(`/culturePlan/${selectedCulturePlanID}`)
        .then(res => {
          setCrop(res.data.result)
        })
    }
  }, [selectedCulturePlanID, counter])

  const handleMoveSubmit = async () => {
    try {
      const payload = {
        Culture_Plan_ID: +selectedCulturePlanID!,
        Source_Area_Name: moveSource,
        Destination_Area_Name: moveDest,
        Quantity: moveQty,
        Transition_Time: transitionTime,
        Remaining_Days: remainingDays,
      };
      const response = await apiClient.post("/movedArea", payload);
      if (response.status === 200) {
        toast.success("Crop moved successfully");

      } else {
        toast.error("An error occurred while moving the crop")
      }
    } catch (error: any) {

      toast.error(error.response?.data?.message || "An error occurred while moving the crop")
      console.error(error);
    } finally {
      setCounter(counter => counter + 1)
      setModalMoveOpen(false);
    }
  };


  type Area = {
    Area_Name: string;
  };

  const [areasWithCulturePlan, setAreasWithCulturePlan] = useState<Area[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);

  const addTask = async () => {
    if (!dueDate || !priority || !title || !assignedTo) {
      setIsError(true);
    } else {
      try {
        const response = await apiClient.post("/tasks/task", {
          Culture_Plan_ID: +selectedCulturePlanID!,
          Task_Category: selectedCategory,
          Title: title,
          Description: desc,
          Priority: priority,
          Due_Date: dueDate,
          Assigned_To: assignedTo
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        closeModal();
        setCounter((counter) => counter + 1);
      } catch (err) {
        setIsError(true);
      }
    }
  };

  // Harvest Modal
  const [modalHarvestOpen, setModalHarvestOpen] = useState(false);
  const [harvestArea, setHarvestArea] = useState("");
  const [harvestType, setHarvestType] = useState("0");
  const [harvestQty, setHarvestQty] = useState("");
  const [harvestNotes, setHarvestNotes] = useState("");

  const handleHarvestSubmit = async () => {
    try {
      const payload = {
        Culture_Plan_ID: +selectedCulturePlanID!,
        Area_Name: harvestArea,
        Harvest_Type: !(+harvestType) ? "all" : "partial",
        Quantity: harvestQty,
      };

      const response = await apiClient.post("/harvestStorage", payload);

      if (response.status === 200) {
        toast.success("Crop harvested successfully");

      } else {
        toast.error("An error occurred while harvesting the crop")
      }
    } catch (error: any) {

      toast.error(error.response?.data?.message || "An error occurred while harvesting the crop")
    } finally {
      setCounter(counter => counter + 1)
      setModalHarvestOpen(false);
    }
  };

  // Separate Modal
  const [modalSeparateOpen, setModalSeparateOpen] = useState(false);
  const [separateSource, setSeparateSource] = useState("");
  const [separateQty, setSeparateQty] = useState(0);

  const handleSeparateSubmit = async () => {
    try {
      const payload = {
        Culture_Plan_ID : +(selectedCulturePlanID as string), 
        New_Current_Quantity: separateQty, 
        Area_Name: separateSource
      };

      const response = await apiClient.put("/movedAreaCurrentQuantity", payload);

      if (response.status === 200) {
        toast.success("Crop separate successfully");

      } else {
        toast.error("An error occurred while separating the crop")
      }
    } catch (error: any) {

      toast.error(error.response?.data?.message || "An error occurred while separating the crop")
      console.error(error);
    } finally {
      setCounter(counter => counter + 1)
      setModalSeparateOpen(false);
    }
  };

  // Dump Modal
  const [modalDumpOpen, setModalDumpOpen] = useState(false);
  const [dumpArea, setDumpArea] = useState("");
  const [dumpQty, setDumpQty] = useState(0);
  const [dumpNotes, setDumpNotes] = useState("");


  const handleDumpSubmit = async () => {
    try {
      const payload = {
        Culture_Plan_ID: +selectedCulturePlanID!,
        Area_Name: dumpArea,
        Quantity: dumpQty,
      };

      const response = await apiClient.post("/trash", payload);

      if (response.status === 200) {
        toast.success("Crop dumped successfully");

      } else {
        toast.error("An error occurred while dumping the crop")
      }
    } catch (error: any) {

      toast.error(error.response?.data?.message || "An error occurred while dumping the crop")
      console.error(error);
    } finally {
      setCounter(counter => counter + 1)
      setModalDumpOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCulturePlanID) return
      try {
        const response = await apiClient.get(`/tasks/allTask?Culture_Plan_ID=${selectedCulturePlanID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        });
        const tasks = response.data.result;
        setData(tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCulturePlanID, counter, accessToken]);

  useEffect(() => {
    if (!Number.isInteger(Number.parseInt(selectedCulturePlanID as string))) {
      return;
    }
    apiClient.get("/areas-with-culture-plan", {
      params: {
        Culture_Plan_ID: selectedCulturePlanID
      }
    })
      .then((res) => res.data)
      .then((data) => setAreasWithCulturePlan(data));

    apiClient.get("/all-areas")
      .then((res) => res.data)
      .then((data) => setAllAreas(data));

      apiClient.get("/movedAreaOfCulturePlan", {
        params: {
          Culture_Plan_ID: selectedCulturePlanID
        }
      })
      .then((res) => res.data)
      .then((data) => setMovedAreaData(data.result));
  }, [selectedCulturePlanID, counter]);

  //handle checkbox
  const handleCheckbox = async (e: any, taskId: number) => {
    e.preventDefault()
    try {
      await apiClient.put(`/tasks/task/${taskId}`, {
        Status: 'Completed'
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setCounter(counter => counter + 1)
    } catch (err) {
      console.log(err)
    }
  }

  const [moveAreaData, setMovedAreaData] = useState<IBatchArea[]>([])


  return (
    <Layout>
      <Row>
        <Col className="mb-3">
          <Link href="/crops">
            <ButtonIcon
              label="Back to Crops Batches"
              icon={<FaLongArrowAltLeft className="me-2" />}
              onClick={() => { }}
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
              <h3 className="py-3">{crop?.Plant_Type}</h3>
              <Row>
                <Col className="mb-3">
                  <small>Batch ID</small>
                  <div>
                    <strong>{crop?.BatchID}</strong>
                  </div>
                </Col>
                <Col className="mb-3">
                  <small>Initial Planning</small>
                  <div>
                    <strong>{crop?.Initial_Quantity} {crop?.Container_Type} {crop?.Area}</strong>
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
                    <strong>{crop?.Current_Quantity} {crop?.Container_Type} {crop?.Area}</strong>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <small>Start Date</small>
                  <div>
                    <strong>{new Date(crop?.Created_Date ?? 0).toLocaleDateString()}</strong>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <small>Remaining days</small>
                  <div>
                    <strong>{crop?.Remaining_Days} days</strong>
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
                <Col className="mb-3">
                  <div className="d-grid gap-2">
                    <ButtonIcon
                      label="Separate tissue"
                      icon={<FaClone className="me-2" />}
                      onClick={() => setModalSeparateOpen(true)}
                      variant="info"
                      isBlock
                    />
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                {moveAreaData.map(
                  (item, index) => (
                    <Col xs={12} sm={12} md={6} lg={4} key={item.Area_Name}>
                      <BatchArea
                        {...item}
                      />
                    </Col>
                  )
                )}
              </Row>

            </Tab>
            <Tab eventKey="notes" title="Tasks &amp; Notes">
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
                              Task_ID: id,
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
                                    <Form.Check type="checkbox" onChange={(e) => handleCheckbox(e, id)} />
                                  </Form>
                                </td>
                                <td>
                                  <TableTaskItem
                                    Task_ID={id}
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
                                  <EditIcon
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
                    {/* <ListGroup>
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
                    </ListGroup> */}
                  </>
                </Panel>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ModalContainer
        title={`Crop: Add New Task from ${crop?.BatchID}`}
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
                <option>Please select assignee</option>
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

      <ModalContainer
        title={`Harvest ${crop?.BatchID}`}
        isShow={modalHarvestOpen}
        handleCloseModal={() => setModalHarvestOpen(false)}
        handleSubmitModal={handleHarvestSubmit}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Choose area to be harvested</Form.Label>
            <Form.Select onChange={(e) => setHarvestArea(e.target.value)}>
              <option>Please select area</option>
              {areasWithCulturePlan.map((area) => (
                <option key={area.Area_Name} value={area.Area_Name}>
                  {area.Area_Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Choose type of harvesting</Form.Label>
            <Form.Select onChange={(e) => setHarvestType(e.target.value)}>
              <option value="0">All</option>
              <option value="1">Partial</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              disabled={!(+harvestType)}
              onChange={(e) => setHarvestQty(e.target.value)}
            />
          </Form.Group>
          {/* <Form.Group className="mb-3">
            <Form.Label>Units</Form.Label>
            <Form.Select onChange={(e) => setHarvestUnit(e.target.value)}>
              <option value="1">Grams</option>
              <option value="2">Kilograms</option>
            </Form.Select>
          </Form.Group> */}
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
        title={`Move ${crop?.BatchID}`}
        isShow={modalMoveOpen}
        handleCloseModal={() => setModalMoveOpen(false)}
        handleSubmitModal={handleMoveSubmit}
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
            <Form.Label>Estimated planting time</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setTransitionTime(e.target.value)}
            />
            {isError && (
              <Form.Text className="text-danger">
                The planned time field is required
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </ModalContainer>

      <ModalContainer
        title={`Dump ${crop?.BatchID}`}
        isShow={modalDumpOpen}
        handleCloseModal={() => setModalDumpOpen(false)}
        handleSubmitModal={handleDumpSubmit}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Choose area</Form.Label>
            <Form.Select onChange={(e) => setDumpArea(e.target.value)}>
              <option>Please select area</option>
              {areasWithCulturePlan.map((area) => (
                <option key={area.Area_Name} value={area.Area_Name}>
                  {area.Area_Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{`How many plants do you want to dump?`}</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setDumpQty(+e.target.value)}
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

      <ModalContainer
        title={`Separate ${crop?.BatchID}`}
        isShow={modalSeparateOpen}
        handleCloseModal={() => setModalSeparateOpen(false)}
        handleSubmitModal={handleSeparateSubmit}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Choose area</Form.Label>
            <Form.Select onChange={(e) => setSeparateSource(e.target.value)}>
              <option>Please select area</option>
              {areasWithCulturePlan.map((area) => (
                <option key={area.Area_Name} value={area.Area_Name}>
                  {area.Area_Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{`New Quantity`}</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setSeparateQty(+e.target.value)}
            />
          </Form.Group>
        </Form>
      </ModalContainer>
    </Layout>
  );
};

export default CropDetail;
