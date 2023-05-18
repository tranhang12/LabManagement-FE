import { useState, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { Col, Form, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import withAuth from "@/middleware/withAuth";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/auth";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import PanelArea from "../components/PanelArea";
import Layout from "../components/Layout";
import apiClient from "@/services/apiClient";
import useModal from "../src/hooks/useModal";

const Areas: NextPage = () => {
  const resetFields = () => {
    setAreaName("");
    setAreaSize(0);
    setAreaUnit("");
    setAreaType("");
    setAreaLocations("");
    setQuantity(0);
  };

  const { modalOpen, showModal, closeModal } = useModal(resetFields);
  const [areaName, setAreaName] = useState("");
  const [areaSize, setAreaSize] = useState(0);
  const [areaUnit, setAreaUnit] = useState("m2");
  const [areaType, setAreaType] = useState("Tissue culture room");
  const [areaLocations, setAreaLocations] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isError, setIsError] = useState(false);
  const authState = useSelector(selectAuthState);
  const { accessToken } = authState;

  const [areaData, setAreaData] = useState<IArea[]>([]);
  interface IArea {
    Area_ID: number;
    Area_Name: string;
    Area_Size: number;
    Area_Unit: string;
    Area_Type: string;
    Area_Locations: string;
    Quantity: number;
  }

  //fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get("/area", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status) {
        setAreaData(response.data);
        console.log(response.data)
      } else {
        console.error("Error fetching current area: " + response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching current area: " + error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // EDIT
  const [editing, setEditing] = useState<IArea | null>(null);

  const handleEdit = (area: IArea) => {
    setEditing(area);

    // Set the default values for the input fields
    setAreaName(area.Area_Name);
    setAreaSize(area.Area_Size);
    setAreaUnit(area.Area_Unit);
    setAreaType(area.Area_Type);
    setAreaLocations(area.Area_Locations);
    setQuantity(area.Quantity);

    setIsAdding(false);
    showModal();
  };

  const handleSave = async () => {
    if (!editing) {
      console.error("No area selected for editing");
      return;
    }
    // Validate area input and call API to update area information
    try {
      const response = await apiClient.put(
        `/area/${editing?.Area_ID}`,
        {
          Area_Name: areaName,
          Area_Size: areaSize,
          Area_Unit: areaUnit,
          Area_Type: areaType,
          Area_Locations: areaLocations,
          Quantity: quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh area data
        fetchData();
        console.log(response);

        // Close modal and reset editingarea
        closeModal();
        resetFields();
        setEditing(null);
      } else {
        console.error("Error updating: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating: " + error);
    }
  };

  // ADD
  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = () => {
    setIsAdding(true);
    showModal();
  };
  const handleCreate = async () => {
    // Validate input and call API to create a new
    try {
      const response = await apiClient.post(
        "/area",
        {
          Area_Name: areaName,
          Area_Size: areaSize,
          Area_Unit: areaUnit,
          Area_Type: areaType,
          Area_Locations: areaLocations,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        // Refresh data
        fetchData();
        console.log(response);

        // Close modal and reset editing
        closeModal();
        resetFields();
        setIsAdding(false);
      } else {
        console.error("Error creating area: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating area: " + error);
    }
  };

  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Areas</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonIcon
            label="Add Area"
            icon={<FaPlus className="me-2" />}
            onClick={handleAdd}
            variant="primary"
          />
        </Col>
      </Row>
      <Row className="mt-3">
        {areaData.map((item, index) => (
          <Col xs={12} sm={12} md={6} lg={4} key={item.Area_ID}>
            <PanelArea
              id={item.Area_ID}
              name={item.Area_Name}
              type={item.Area_Type}
              size={item.Area_Size}
              unit={item.Area_Unit}
              location={item.Area_Locations}
              quantity={item.Quantity}
              edit={true}
              onClick={() => handleEdit(item as IArea)}
            />
          </Col>
        ))}
      </Row>
      <ModalContainer
        title={isAdding ? "Add Area" : "Edit Area"}
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={isAdding ? handleCreate : handleSave}
      >
        <>
          <small className="text-muted">
            An area is a space where you grow your plants. It could be a lab,
            nursery, greenhouse, or anything that describes the different
            physical locations in your facility.
          </small>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Area Name</Form.Label>
              <Form.Control
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
              {isError && (
                <Form.Text className="text-danger">
                  The name field is required
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    value={areaSize}
                    onChange={(e) => setAreaSize(Number(e.target.value))}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The size field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value)}
                  >
                    <option value="m2">m2</option>
                    <option value="Ha">Ha</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col xs={6}>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={areaType}
                    onChange={(e) => setAreaType(e.target.value)}
                  >
                    <option value="Tissue culture room">
                      Tissue culture room
                    </option>
                    <option value="Tissue culture laboratory">
                      Tissue culture laboratory
                    </option>
                  </Form.Select>
                </Col>
                <Col xs={6}>
                  <Form.Label>Locations</Form.Label>
                  <Form.Control
                    type="text"
                    value={areaLocations}
                    onChange={(e) => setAreaLocations(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The size location is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </>
      </ModalContainer>
    </Layout>
  );
};

export default Areas;
